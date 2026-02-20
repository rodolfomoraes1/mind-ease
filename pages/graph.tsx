import Head from 'next/head';
import { MfeChart } from '../components/external';

export default function Home() {
  return (
    <>
      <Head>
        <title>Mind Ease - Dashboard</title>
        <meta name="description" content="Dashboard com microfrontend Angular" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <h1 style={{
          color: '#333',
          fontSize: '2.5rem',
          textAlign: 'center' as const,
          marginBottom: '40px'
        }}>
          🧠 Mind Ease - Dashboard
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '30px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Card 1 - Vendas Mensais */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '1.3rem',
              marginBottom: '15px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              📊 Vendas Mensais
            </h2>
            <MfeChart
              title="Vendas 2024"
              values={[450, 780, 920, 610, 830, 950]}
              labels={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho']}
              height={300}
            />
          </div>

          {/* Card 2 - Comparativo Anual */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '1.3rem',
              marginBottom: '15px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              📈 Comparativo Anual
            </h2>
            <MfeChart
              labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}
              datasets={[
                { 
                  label: '2023', 
                  data: [320, 450, 380, 520, 490, 610],
                  backgroundColor: 'rgba(54, 162, 235, 0.7)'
                },
                { 
                  label: '2024', 
                  data: [450, 780, 920, 610, 830, 950],
                  backgroundColor: 'rgba(255, 99, 132, 0.7)'
                }
              ]}
              height={300}
            />
          </div>

          {/* Card 3 - Estoque */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '1.3rem',
              marginBottom: '15px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              🎨 Estoque
            </h2>
            <MfeChart
              title="Estoque por Produto"
              labels={['Notebook', 'Mouse', 'Teclado', 'Monitor', 'SSD']}
              values={[1200, 850, 2100, 1600, 950]}
              colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFE66D']}
              options={{
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: 'Quantidade'
                    }
                  }
                }
              }}
              height={300}
            />
          </div>

          {/* Card 4 - Atendimentos */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '1.3rem',
              marginBottom: '15px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              ⭐ Atendimentos
            </h2>
            <MfeChart
              data={{
                labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                datasets: [
                  {
                    label: 'Manhã',
                    data: [12, 19, 15, 17, 14, 8],
                    backgroundColor: 'rgba(255, 206, 86, 0.7)'
                  },
                  {
                    label: 'Tarde',
                    data: [18, 24, 22, 25, 20, 12],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                  }
                ]
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Atendimentos por Período'
                  }
                }
              }}
              height={300}
            />
          </div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '40px auto 0',
          padding: '20px',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#0d47a1'
        }}>
          <p>
            <strong>📦 Microfrontend:</strong> Carregado de {' '}
            <code style={{ background: '#bbdefb', padding: '2px 6px', borderRadius: '4px' }}>
              https://mfe-chart-static.vercel.app/main.js
            </code>
          </p>
        </div>
      </div>
    </>
  );
}
