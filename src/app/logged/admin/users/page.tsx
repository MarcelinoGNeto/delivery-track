"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  role: z.enum(["user", "admin"]),
});

type FormData = z.infer<typeof schema>;

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export default function CreateUserPage() {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "user",
    },
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Erro ao criar usuário");
      }

      toast.success("Usuário criado com sucesso!");
      reset();
      fetchUsers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir usuário");

      toast.success("Usuário excluído");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Erro ao excluir usuário");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label>Perfil</Label>
              <Select
                defaultValue="user"
                onValueChange={(value) => setValue("role", value as "user" | "admin")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar Usuário"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Senha</th>
              <th className="px-4 py-2">Perfil</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">••••••••</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user._id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}