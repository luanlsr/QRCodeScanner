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
    const [comboCount, setComboCount] = useState(0);
    const [valorPorTipo, setValorPorTipo] = useState({
        combo: 0,
        ingresso: 0,
    });
    const [sent, setSent] = useState(0);
    const [data, setData] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const notSent = total - sent;
    const chartData = [
        { name: 'Enviados', value: sent },
        { name: 'Não enviados', value: notSent },
    ];

    const chartTipoData = [
        { name: 'Combos Pipoca', value: valorPorTipo.combo },
        { name: 'Ingressos', value: valorPorTipo.ingresso },
    ];

    const COLORS = ['#10B981', '#FBBF24'];

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
                const qtdCombo = data.filter((p) => p.combo).length
                setComboCount(qtdCombo);
                const comboValor = qtdCombo * 15;
                const ingressoValor = data.reduce((acc, curr) => acc + (curr.valor || 0), 0) - comboValor;

                setValorPorTipo({
                    combo: comboValor,
                    ingresso: ingressoValor,
                });
            }

            setLoading(false);
        };

        fetchParticipants();
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
        <main className="pt-[80px] px-4 py-6 bg-gray-50 dark:bg-gray-900" style={{ height: 'calc(100vh - 73px)' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold">{loading ? '...' : total}</h2>
                        <p>Total de Participantes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-green-600">{loading ? '...' : sent}</h2>
                        <p>Enviados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-yellow-600">{loading ? '...' : notSent}</h2>
                        <p>Não enviados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-purple-600">{loading ? '...' : comboCount}</h2>
                        <p>Participantes com Combo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-blue-600">
                            {loading ? '...' : valorPorTipo.ingresso.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </h2>
                        <p>Valor Total Ingressos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-blue-600">
                            {loading ? '...' : valorPorTipo.combo.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </h2>
                        <p>Valor Total Combo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold text-blue-600">
                            {loading ? '...' : valorTotal.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </h2>
                        <p>Valor Total Arrecadado</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {/* Gráfico - Status de Presença */}
                <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800 dark:text-white">
                    <h2 className="text-lg font-semibold mb-2">Status de Presença</h2>
                    <div className="h-64 flex items-center justify-center text-gray-400 ">
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
                <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800 dark:text-white">
                    <h2 className="text-lg font-semibold mb-2">Distribuição de Arrecadação</h2>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartTipoData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, value }) => `R$ ${value}`}
                                    animationDuration={800}
                                >
                                    <Cell fill="#3B82F6" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip formatter={(value: number) => `R$ ${value}`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </main>
    );
};
