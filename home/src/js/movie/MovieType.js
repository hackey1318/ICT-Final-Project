import "../../css/movie/TypeFilter.css";

const types = [
    { label: '전체', value: 'ALL' },
    { label: '상영중', value: 'PRESENT' },
    { label: '상영 예정', value: 'PREPARATION' }
];

export default function TypeFilter({ type, setType }) {
    return (
        <div className="type-filter">
            {types.map(({ label, value }, index) => (
                <span key={value} className="type-item">
                    <button
                        className={`type-button ${type === value ? 'active' : ''}`}
                        onClick={() => setType(value)}
                    >
                        {label}
                    </button>
                    {index !== types.length - 1 && <span className="divider">/</span>}
                </span>
            ))}
        </div>
    );
}
