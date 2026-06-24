import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z }  from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

const signInSchema = z.object({
  username: z.string().min(3, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Vui lòng nhập mật khẩu"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const {signIn} = useAuthStore();
    const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors,isSubmitting}} = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  })

  const onsubmit = async (data: SignInFormValues) => {
    const {username,password} = data;
    await signIn(username,password);
    navigate("/")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onsubmit)}>
            <div className="flex flex-col gap-6">
              {/* header */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold">Chào mừng quay trở lại</h1>
                <p className="text-muted-foreground text-balance">Chào mừng bạn đến với Chat App</p>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                  <label htmlFor="username" className="block text-sm">
                    Tên đăng nhập
                  </label>
                  <Input type="text" id = "username" placeholder="Chat" {...register("username")}/>
                  {errors.username && (
                    <p className="error-message">{errors.username.message}</p>
                  )}
                </div>
              {/* password */}
              <div className="flex flex-col gap-3">
                  <label htmlFor="password" className="block text-sm">
                    Mật khẩu
                  </label>
                  <Input type="password" id = "password" placeholder="Nhập mật khẩu" {...register("password")}/>
                  {errors.password && (
                    <p className="error-message">{errors.password.message}</p>
                  )}
              </div>
              {/* nút đăng ký */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>Đăng nhập</Button>
              <div className="text-center text-sm">Chưa có tài khoản?{""}
                <a href="/signup" className="underline underline-offset-4 hover:text-primary">Đăng ký</a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balancedpx-6 text px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]underline *:[a]:underline-offset-4">
        để tiếp túc hãy đồng ý với <a href="#">Điều khoản và dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  )
}

