"use client";

import Link from "next/link";

export default function ProjectDetailError({
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
						<h1>Failed to load project</h1>
						<p className="mt-3">We couldn&apos;t load this project. Please try again later.</p>
						<div className="d-flex gap-3 justify-content-center mt-3">
							<button className="btn btn-dark" onClick={() => reset()}>
								Try again
							</button>
							<Link href="/projects" className="btn btn-outline-dark">
								Back to projects
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
