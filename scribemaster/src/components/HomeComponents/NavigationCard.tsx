import { useState } from "react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NavigationCardProps {
  label: string;
  to: string;
  description: string;
  icon: LucideIcon;
}

export const NavigationCard = ({
  label,
  to,
  description,
  icon: Icon,
}: NavigationCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full h-full cursor-pointer transition-all duration-200 group"
      onClick={() => navigate(to)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
            <Icon className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-sm leading-tight">{label}</h3>

            {/* Description - shows on hover */}
            <p
              className={`text-xs text-muted-foreground transition-all duration-200 ${
                isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
