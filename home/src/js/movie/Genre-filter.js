import "../../css/movie/GenreFilter.css";

const genres = [
	{ id: "All", name: "전체" },
	{ id: "Fantasy", name: "환타지" },
	{ id: "Romance", name: "로맨스" },
	{ id: "Crime", name: "범죄" },
	{ id: "Drama", name: "드라마" },
	{ id: "Action", name: "액션" },
	{ id: "Horror", name: "호러" },
	{ id: "Animation", name: "애니메이션" },
];

export default function GenreFilter({ selectedGenre, onSelect }) {
	return (
		<div className="genre-filter">
			{genres.map((genre) => (
				<button
					key={genre.id}
					className={`genre-button ${selectedGenre?.id === genre.id ? "active" : ""}`}
					onClick={() => onSelect(genre)}
				>
					{genre.id}
				</button>
			))}
		</div>
	);
}
