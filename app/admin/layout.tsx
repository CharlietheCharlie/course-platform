import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { Badge} from "@/components/ui/badge";
import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <NavBar />
        {children}
    </>;
}

function NavBar() {
    return <header className="flex h-12 shadow bg-background z-10">
        <nav className="flex gap-4 container">
            <div className="mr-auto flex items-center gap-2">
                <Link href="/"
                    className="text-lg hover:underline">
                    Charlie Frontend
                </Link>
                <Badge>Admin</Badge>
            </div>

            <AdminLink />
            <Link href="/admin/courses" className="hover:bg-accent/10 flex items-center px-2">
                Courses
            </Link>
            <Link href="/admin/products" className="hover:bg-accent/10 flex items-center px-2">
                Products
            </Link>
            <Link href="/admin/sales" className="hover:bg-accent/10 flex items-center px-2">
                Sales
            </Link>
            <div className="size-8 self-center">
                <UserButton appearance={{
                    elements: {
                        userButtonAvatarBox: { width: "100%", height: "100%" }
                    }
                }} />
            </div>
            <SignedOut>
                <Button className="self-center" asChild>
                    <Link href="/sign-in">Sign In</Link>
                </Button>
            </SignedOut>
        </nav>
    </header >
}

async function AdminLink() {
    const user = await getCurrentUser();
    if (!canAccessAdminPages(user)) return null;
    return <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
        Admin
    </Link>
}