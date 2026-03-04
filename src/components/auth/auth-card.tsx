import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="glass w-full max-w-md rounded-2xl border-gray-100 shadow-float animate-fade-in">
      <CardHeader className="pb-2">
        <span className="inline-flex lg:hidden items-center gap-2 mb-4 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase w-fit">
          E-Canteen
        </span>
        <CardTitle className="font-serif text-3xl font-bold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {children}

        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {footer}
      </CardContent>
    </Card>
  );
}
