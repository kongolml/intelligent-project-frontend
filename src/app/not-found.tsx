import Link from "next/link";

export default function NotFound() {
	return (
		<main>
			<div className="container">
				<div className="row">
					<div className="col text-center py-5">
						<h1>Page not found</h1>
						<p className="mt-3">The page you&apos;re looking for doesn&apos;t exist.</p>
						<Link href="/" className="btn btn-dark mt-3">
							Go home
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
