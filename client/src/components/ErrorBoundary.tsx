import { Component, CSSProperties, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

// Стили заданы прямо здесь: экран ошибки должен работать даже тогда,
// когда не загрузился основной CSS.
const styles: Record<string, CSSProperties> = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: '#111',
        color: '#fff',
    },
    title: { fontSize: '24px', margin: 0 },
    text: { fontSize: '16px', lineHeight: 1.5, margin: 0, maxWidth: '420px', opacity: 0.8 },
    button: {
        marginTop: '8px',
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        background: '#fff',
        color: '#111',
        cursor: 'pointer',
    },
};

// Без этой обёртки любая ошибка во время рендера размонтирует всё дерево
// и пользователь видит пустую белую страницу без единой подсказки.
class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Ошибка рендера:', error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div style={styles.wrapper}>
                <h1 style={styles.title}>Что-то пошло не так</h1>
                <p style={styles.text}>
                    Страница не загрузилась. Обновите её — обычно это помогает.
                </p>
                <button style={styles.button} onClick={() => window.location.reload()}>
                    Обновить страницу
                </button>
            </div>
        );
    }
}

export default ErrorBoundary;
