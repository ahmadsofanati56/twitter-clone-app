import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="sticky top-0 px-3 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="h-7 w-7" />

                <span className=" hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              {" "}
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-7 w-7" />

                  <span className=" hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              {" "}
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-7 w-7 fill-green-700" />

                  <span className=" hidden text-lg text-green-700 md:inline">
                    Log In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect red>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-7 w-7 fill-red-700" />

                  <span className=" hidden text-lg text-red-700 md:inline">
                    Log Out
                  </span>
                </span>
              </IconHoverEffect>{" "}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
