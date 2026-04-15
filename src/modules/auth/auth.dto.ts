export type LoginDto = {
  username: string
  password: string
}
export type LoginRootDto = LoginDto & { uid: number }


