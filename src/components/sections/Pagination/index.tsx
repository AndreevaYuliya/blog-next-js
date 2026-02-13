import { FC } from "react";

import Link from "next/link";

import styles from "./styles.module.css";

import Image from "next/image";

type Props = {
  total: number;
  limit: number;
  page: number;
};

const buildRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const Pagination: FC<Props> = (props) => {
  const { total, limit, page } = props;

  const pageCount = Math.ceil(total / limit);

  if (!pageCount) {
    return null;
  }

  const items =
    pageCount <= 7
      ? buildRange(1, pageCount)
      : (() => {
          const middleStart = Math.max(2, page - 1);
          const middleEnd = Math.min(pageCount - 1, page + 1);

          const result: (number | "ellipsis")[] = [1];

          if (middleStart > 2) {
            result.push("ellipsis");
          }

          buildRange(middleStart, middleEnd).forEach((p) => result.push(p));

          if (middleEnd < pageCount - 1) {
            result.push("ellipsis");
          }

          result.push(pageCount);

          return result;
        })();

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < pageCount ? page + 1 : null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <ul className={styles.list}>
        <li>
          {prevPage ? (
            <Link
              href={`?page=${prevPage}`}
              className={styles.navButton}
              aria-label="Previous page"
              title="Previous page"
            >
              <span aria-hidden="true">
                <Image
                  src="/arrow-left-icon.svg"
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  priority
                />
              </span>
            </Link>
          ) : (
            <span
              className={`${styles.navButton} ${styles.disabled}`}
              aria-hidden="true"
            >
              <Image
                src="/arrow-left-icon.svg"
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                priority
              />
            </span>
          )}
        </li>

        {items.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className={styles.ellipsis}>...</span>
              </li>
            );
          }

          return (
            <li key={item}>
              <Link
                href={`?page=${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${styles.link} ${
                  item === page ? styles.linkActive : ""
                }`}
              >
                {item}
              </Link>
            </li>
          );
        })}

        <li>
          {nextPage ? (
            <Link
              href={`?page=${nextPage}`}
              className={styles.navButton}
              aria-label="Next page"
              title="Next page"
            >
              <span aria-hidden="true">
                <Image
                  src="/arrow-right-icon.svg"
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  priority
                />
              </span>
            </Link>
          ) : (
            <span
              className={`${styles.navButton} ${styles.disabled}`}
              aria-hidden="true"
            >
              <Image
                src="/arrow-right-icon.svg"
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                priority
              />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

