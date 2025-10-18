import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (password: string) => void;
}

const ADMIN_PASSWORD = 'Aonddick1';

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin(password);
      setPasswordError('');
    } else {
      setPasswordError('Неверный пароль');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center">
            <Icon name="Lock" className="inline-block mb-2" size={40} />
            <div>Вход в админ-панель</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Введите пароль"
                required
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-destructive mt-2">{passwordError}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              <Icon name="LogIn" className="mr-2" size={18} />
              Войти
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <Icon name="Home" className="mr-2" size={18} />
              На главную
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
