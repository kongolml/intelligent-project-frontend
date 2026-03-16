import Link from "next/link";

export default function ProjectNotFound() {
	return (
		<main>
			<div className="container">
				<div className="row">
					<div className="col text-center py-5">
						<h1>Project not found</h1>
						<p className="mt-3">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
						<Link href="/projects" className="btn btn-dark mt-3">
							Back to projects
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
