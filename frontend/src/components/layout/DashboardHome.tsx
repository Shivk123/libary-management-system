import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface DashboardHomeProps {
  title: string;
  description: string;
  cards: DashboardCard[];
}

export default function DashboardHome({ title, description, cards }: DashboardHomeProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="text-center space-y-6">
          <CardTitle className="text-5xl font-serif font-bold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-xl font-sans leading-relaxed max-w-3xl mx-auto">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {cards.map((card) => (
            <Card 
              key={card.title}
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={card.onClick}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-3">
                  <card.icon className="h-7 w-7" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}