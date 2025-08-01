import { Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="relative bottom-0 border-t h-20 w-full">
            <div className="flex items-center justify-between sm:px-10 px-4 h-20">
                <div className="sm:px-10">
                    <Image
                        src="/Image/LOGO-dark.png"
                        alt="LOGO"
                        width={100}
                        height={30}
                        className="object-contain hidden dark:block"
                    />
                    <Image
                        src="/Image/LOGO-light.png"
                        alt="LOGO"
                        width={100}
                        height={30}
                        className="object-contain dark:hidden"
                    />
                </div>
                <div className="flex gap-4 sm:px-10">
                    <Link href="https://www.instagram.com/vito_x666">
                        <Instagram />
                    </Link>
                    <Link href="https://www.youtube.com/@vitoX666">
                        <Youtube />
                    </Link>
                </div>
            </div>
        </div>
    )
}