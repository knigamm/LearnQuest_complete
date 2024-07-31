import { cn } from "@/lib/utils";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  isLoading: boolean;
}

export const LoadingSpinner = ({
  size = 3,
  className,
  isLoading,
  ...props
}: ISVGProps) => {
  if (!isLoading) return;
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center blur-sm]">
      <div className="absolute inset-0 bg-black/30 opacity-20 backdrop-blur-2xlxl"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}rem`}
        height={`${size}rem`}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin relative", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
