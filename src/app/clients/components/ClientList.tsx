interface ClientListProps {
    clients: any[];
  }
  
  export default function ClientList({ clients }: ClientListProps) {
    if (clients.length === 0)
      return <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>;
  
    return (
      <ul className="space-y-1">
        {clients.map((c) => (
          <li key={c._id} className="border-b pb-1">
            <span className="font-medium">{c.name}</span> — {c.cpf}
          </li>
        ))}
      </ul>
    );
  }
  