package com.ict.finalProject.common.exception;


import com.ict.finalProject.common.exception.custom.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.security.InvalidParameterException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.OBJECT_NOT_FOUND)
				.errorMsg(e.getMessage()).build(), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(SimilarRequestException.class)
	public ResponseEntity<ErrorResponse> handleSimilarRequestException(SimilarRequestException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.SIMILAR_REQUEST_FOUND)
				.errorMsg(e.getMessage()).build(), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(InvalidParameterException.class)
	public ResponseEntity<ErrorResponse> handleInvalidParameterException(InvalidParameterException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.INVALID_PARAMETER)
				.errorMsg(e.getMessage()).build(), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(InfoModifyException.class)
	public ResponseEntity<ErrorResponse> handleInfoModifyException(InfoModifyException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.ERR_MODIFY_DATA)
				.errorMsg(e.getMessage()).build(), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UserStatusException.class)
	public ResponseEntity<ErrorResponse> handleUserStatusException(UserStatusException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.OBJECT_NOT_FOUND)
				.errorMsg(e.getMessage()).build(), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ServiceDevelopNotYetException.class)
	public ResponseEntity<ErrorResponse> handleServiceDevelopNotYetException(ServiceDevelopNotYetException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.API_DEVELOP_NOT_YET)
				.errorMsg(e.getMessage()).build(), HttpStatus.NOT_IMPLEMENTED);
	}

	@ExceptionHandler(InvalidPasswordException.class)
	public ResponseEntity<ErrorResponse> handleInvalidPasswordException(InvalidPasswordException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.INVALID_PARAMETER)
				.errorMsg(e.getMessage()).build(), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UserAuthenticationException.class)
	public ResponseEntity<ErrorResponse> handleUserAuthenticationException(UserAuthenticationException e) {

		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.UNAUTHORIZED)
				.errorMsg(e.getMessage()).build(), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGenericException(Exception ex) {
		ex.printStackTrace();
		return new ResponseEntity<>(
			ErrorResponse.builder()
				.errorCode(ErrorCode.INTERNAL_SERVER_ERROR)
				.errorMsg("An unexpected error occurred").build(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
