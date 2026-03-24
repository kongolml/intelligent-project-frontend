"use client";

export default function Error({
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
						<h1>Something went wrong</h1>
						<p className="mt-3">An unexpected error occurred. Please try again.</p>
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
