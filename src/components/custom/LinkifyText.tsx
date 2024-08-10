import Link from "next/link";
import { PropsWithChildren } from "react";
import { LinkItUrl, LinkIt, emailRegex } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";

export default function Linkify({ children }: PropsWithChildren) {
  return (
    <LinkifyHastag>
      <LinkifyEmail>
        <LinkifyUsername>
          <LinkItUrl className="text-primary hover:underline">
            {children}
          </LinkItUrl>
        </LinkifyUsername>
      </LinkifyEmail>
    </LinkifyHastag>
  );
}

function LinkifyEmail({ children }: PropsWithChildren) {
  return (
    <LinkIt
      regex={emailRegex}
      component={(match, key) => {
        return (
          <Link
            className="text-primary hover:underline"
            key={key}
            href={`/email/${match}`}
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyUsername({ children }: PropsWithChildren) {
  return (
    <LinkIt
      regex={/(?<=\s|^)(@[a-zA-Z0-9_-]+)/} //(?<=\s|^)
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip key={key} username={username}>
            {match}
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHastag({ children }: PropsWithChildren) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const hastag = match.slice(1);
        return (
          <Link
            className="text-primary hover:underline"
            key={key}
            href={`/hastag/${hastag}`}
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
