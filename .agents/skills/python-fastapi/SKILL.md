---
name: python-fastapi
description: "Build high-performance APIs using FastAPI framework with Python type hints."
---

# Python FastAPI

## Overview
FastAPI is a modern Python web framework for building APIs with automatic documentation. This skill should be invoked when building high-performance APIs that benefit from Python's type hints and FastAPI's automatic validation.

## Core Principles
- **Type Hints**: Leverage Python type hints for validation
- **Automatic Docs**: OpenAPI/Swagger generated automatically
- **Async Support**: Native async/await support
- **Dependency Injection**: Use Depends for clean code

## Preparation Checklist
- [ ] Install FastAPI: `pip install fastapi`
- [ ] Choose ASGI server (Uvicorn, Hypercorn)
- [ ] Plan API structure
- [ ] Define Pydantic models

## Step-by-Step Process
1. **Install**: Add FastAPI and uvicorn
2. **Define Models**: Create Pydantic models
3. **Routes**: Add route handlers
4. **Validate**: Use type hints and Pydantic
5. **Document**: Access automatic docs at /docs
6. **Run**: Start with uvicorn

## Do's and Don'ts
- ✅ **Do** use Pydantic for validation
- ✅ **Do** leverage async for I/O operations
- ✅ **Do** use dependency injection
- ❌ **Don't** ignore type hints
- ❌ **Don't** skip error handling
- ❌ **Don't** use sync code for DB calls

## Anti-Patterns
- **No Validation**: Skipping Pydantic models
- **Sync DB**: Using synchronous database calls
- **Missing Errors**: Not handling HTTP exceptions
- **No Docs**: Not reviewing automatic docs
