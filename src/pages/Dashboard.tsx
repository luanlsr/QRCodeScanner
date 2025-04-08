import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { supabase } from '../superbase';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Person } from '../types';
import { getAllParticipants } from '../data/crud';


export const Dashboard = () => {
    const [total, setTotal] = useState(0);
    const [totalValor, setTotalValor] = useState(0);
    const [sent, setSent] = useState(0);
    const [data, setData] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const notSent = total - sent;
    const chartData = [
        { name: 'Enviados', value: sent },
        { name: 'Não enviados', value: notSent },
    ];

    const COLORS = ['#10B981', '#FBBF24']; // verde e amarelo

    const valorTotal = data.reduce((acc, curr) => acc + (curr.valor || 0), 0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllParticipants();
            setData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchParticipants = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('participants').select('*');

            if (error) {
                console.error('Erro ao buscar participantes:', error);
            } else {
                setTotal(data.length);
                setSent(data.filter((p) => p.sent).length);
            }

            setLoading(false);
        };

        fetchParticipants();
    }, []);

    return (
        <main className="pt-[80px] px-4 py-6 bg-gray-50" style={{ height: 'calc(100vh - 73px)' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold">{loading ? '...' : total}</h2>
                        <p>Total de Participantes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-green-600">{loading ? '...' : sent}</h2>
                        <p>Enviados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-yellow-600">{loading ? '...' : notSent}</h2>
                        <p>Não enviados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-blue-600">
                            {loading ? '...' : totalValor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </h2>
                        <p>Valor Total Arrecadado</p>
                    </CardContent>
                </Card>
            </div>
            {/* Gráfico (opcional) */}
            <div className="bg-white rounded-xl shadow p-4 mb-8">
                <h2 className="text-lg font-semibold mb-2">Status de Presença</h2>
                <div className="h-64 flex items-center justify-center text-gray-400">
                    {/* Gráfico pode ser inserido aqui com Recharts */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                animationDuration={800}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Últimos Participantes */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-2">Últimos Participantes</h2>
                <ul className="divide-y">
                    <li className="py-2 flex justify-between">
                        <span>Maria Fernanda</span>
                        <span className="text-sm text-green-600">Confirmado</span>
                    </li>
                    <li className="py-2 flex justify-between">
                        <span>João Silva</span>
                        <span className="text-sm text-red-500">Não Confirmado</span>
                    </li>
                    <li className="py-2 flex justify-between">
                        <span>Ana Clara</span>
                        <span className="text-sm text-green-600">Confirmado</span>
                    </li>
                </ul>
            </div>
        </main>
    );
};
