"use client";

export default function ProjectsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main>
			<div className="container">
				<div className="row">
					<div className="col text-center py-5">
						<h1>Failed to load projects</h1>
						<p className="mt-3">We couldn&apos;t load the projects. Please try again later.</p>
						<button
							className="btn btn-dark mt-3"
							onClick={() => reset()}
						>
							Try again
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
