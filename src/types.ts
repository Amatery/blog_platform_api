import { Request } from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithQueryAndParams<T, P> = Request<T, {}, {}, P>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>


export type BlogsType = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string
}

export type ErrorMessagesType = {
  message: string, field: string
}

export type ErrorsType = {
  errorsMessages: Array<ErrorMessagesType>
}