
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class BadRequestError(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(message, 400)

class InvalidDataError(AppException):
    def __init__(self, message: str = "Invalid data"):
        super().__init__(message, 400)

class UnauthorizedError(AppException):
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, 401)

class InvalidCredentialsError(AppException):
    def __init__(self, message: str = "Invalid email or password"):
        super().__init__(message, 401)

class InvalidTokenError(AppException):
    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(message, 401)

class ForbiddenError(AppException):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, 403)

class InsufficientPermissionError(AppException):
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, 403)

class ResourceNotFoundError(AppException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} not found", 404)

class UserNotFoundError(AppException):
    def __init__(self):
        super().__init__("User not found", 404)

class StudentNotFoundError(AppException):
    def __init__(self):
        super().__init__("Student not found", 404)

class GradeNotFoundError(AppException):
    def __init__(self):
        super().__init__("Grade not found", 404)

class CourseNotFoundError(AppException):
    def __init__(self):
        super().__init__("Course not found", 404)

class ConflictError(AppException):
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(message, 409)

class EmailAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__("Email already exists", 409)

class DuplicateResourceError(AppException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} already exists", 409)

class BusinessRuleViolationError(AppException):
    def __init__(self, message: str = "Business rule violation"):
        super().__init__(message, 422)

class InvalidOperationError(AppException):
    def __init__(self, message: str = "Operation is not allowed"):
        super().__init__(message, 422)

class TooManyRequestsError(AppException):
    def __init__(self, message: str = "Too many requests"):
        super().__init__(message, 429)

class InternalServerError(AppException):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(message, 500)

class ServiceUnavailableError(AppException):
    def __init__(self, message: str = "Service temporarily unavailable"):
        super().__init__(message, 503)
