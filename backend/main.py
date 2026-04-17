import os
import resource
import shutil
import subprocess
import tempfile
from typing import List

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


TIME_LIMIT_SECONDS = 1
MEMORY_LIMIT_BYTES = 512 * 1024 * 1024
MAX_OUTPUT_BYTES = 1024 * 1024
TESTCASES_DIR = os.path.join(os.path.dirname(__file__), "testcases")


class TestResult(BaseModel):
    test_name: str
    status: str
    time_ms: int
    memory_kb: int
    expected: str
    actual: str
    stderr: str


class SubmissionResponse(BaseModel):
    status: str
    compile_stderr: str
    compile_stdout: str
    results: List[TestResult]


app = FastAPI(title="C++ Submission Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_testcases() -> List[tuple[str, str, str]]:
    if not os.path.isdir(TESTCASES_DIR):
        raise HTTPException(status_code=500, detail="Testcase directory is missing.")

    inputs = sorted([f for f in os.listdir(TESTCASES_DIR) if f.endswith(".in")])
    testcases: List[tuple[str, str, str]] = []

    for input_file in inputs:
        base_name = input_file[:-3]
        output_file = f"{base_name}.out"
        output_path = os.path.join(TESTCASES_DIR, output_file)
        input_path = os.path.join(TESTCASES_DIR, input_file)

        if not os.path.isfile(output_path):
            raise HTTPException(
                status_code=500, detail=f"Missing expected output file for {input_file}."
            )

        with open(input_path, "r", encoding="utf-8") as f_in:
            test_input = f_in.read()
        with open(output_path, "r", encoding="utf-8") as f_out:
            expected_output = f_out.read()

        testcases.append((base_name, test_input, expected_output))

    if not testcases:
        raise HTTPException(status_code=500, detail="No testcases found.")

    return testcases


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/submit", response_model=SubmissionResponse)
async def submit_cpp(file: UploadFile = File(...)) -> SubmissionResponse:
    if not file.filename or not file.filename.endswith(".cpp"):
        raise HTTPException(status_code=400, detail="Only .cpp files are allowed.")

    testcases = load_testcases()
    temp_dir = tempfile.mkdtemp(prefix="cpp_submit_")
    source_path = os.path.join(temp_dir, "main.cpp")
    binary_path = os.path.join(temp_dir, "main")

    try:
        with open(source_path, "wb") as target:
            shutil.copyfileobj(file.file, target)

        compile_proc = subprocess.run(
            ["g++", source_path, "-O2", "-std=c++17", "-o", binary_path],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )

        if compile_proc.returncode != 0:
            return SubmissionResponse(
                status="compilation_error",
                compile_stderr=compile_proc.stderr,
                compile_stdout=compile_proc.stdout,
                results=[],
            )

        results: List[TestResult] = []

        for test_name, test_input, expected_output in testcases:
            cmd = [
                "/usr/bin/time",
                "-f",
                "%e %M",
                binary_path,
            ]
            status = "accepted"
            stderr = ""
            actual = ""
            time_ms = 0
            memory_kb = 0

            try:
                run_proc = subprocess.run(
                    cmd,
                    input=test_input,
                    capture_output=True,
                    text=True,
                    timeout=TIME_LIMIT_SECONDS + 0.2,
                    check=False,
                    preexec_fn=lambda: resource.setrlimit(
                        resource.RLIMIT_AS, (MEMORY_LIMIT_BYTES, MEMORY_LIMIT_BYTES)
                    ),
                )
                actual = run_proc.stdout[:MAX_OUTPUT_BYTES]
                stderr_full = run_proc.stderr

                stderr_lines = stderr_full.strip().splitlines() if stderr_full else []
                if stderr_lines:
                    metrics_line = stderr_lines[-1]
                    other_stderr = "\n".join(stderr_lines[:-1]).strip()
                    try:
                        elapsed_seconds, max_kb = metrics_line.split()
                        time_ms = int(float(elapsed_seconds) * 1000)
                        memory_kb = int(max_kb)
                    except (ValueError, TypeError):
                        other_stderr = stderr_full.strip()
                    stderr = other_stderr

                if run_proc.returncode != 0:
                    if run_proc.returncode < 0:
                        status = "runtime_error"
                    else:
                        status = "runtime_error"

                if memory_kb > MEMORY_LIMIT_BYTES // 1024:
                    status = "memory_limit_exceeded"
                elif time_ms > TIME_LIMIT_SECONDS * 1000:
                    status = "time_limit_exceeded"
                elif status == "accepted":
                    expected_normalized = expected_output.strip()
                    actual_normalized = actual.strip()
                    if expected_normalized != actual_normalized:
                        status = "wrong_answer"

            except subprocess.TimeoutExpired:
                status = "time_limit_exceeded"
                stderr = "Execution exceeded 1 second."

            results.append(
                TestResult(
                    test_name=test_name,
                    status=status,
                    time_ms=time_ms,
                    memory_kb=memory_kb,
                    expected=expected_output,
                    actual=actual,
                    stderr=stderr,
                )
            )

            if status != "accepted":
                return SubmissionResponse(
                    status=status,
                    compile_stderr=compile_proc.stderr,
                    compile_stdout=compile_proc.stdout,
                    results=results,
                )

        return SubmissionResponse(
            status="accepted",
            compile_stderr=compile_proc.stderr,
            compile_stdout=compile_proc.stdout,
            results=results,
        )
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
