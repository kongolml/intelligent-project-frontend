import Link from "next/link";

export default function ProjectsNotFound() {
	return (
		<main>
			<div className="container">
				<div className="row">
					<div className="col text-center py-5">
						<h1>Projects not found</h1>
						<p className="mt-3">We couldn&apos;t find what you were looking for.</p>
						<Link href="/" className="btn btn-dark mt-3">
							Go home
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
