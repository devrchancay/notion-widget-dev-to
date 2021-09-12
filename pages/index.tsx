import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

export const getServerSideProps = async ({ query }) => {
  const users = query?.users?.split(",") ?? [];

  const usersPromise = users.map((user) => {
    return fetch(`https://dev.to/api/articles?username=${user}`).then((user) =>
      user.json()
    );
  });

  const blogPosts = await Promise.all(usersPromise);

  return {
    props: {
      blogPosts,
    },
  };
};

const IndexPage = ({ blogPosts }) => {
  const router = useRouter();
  const usersQuery = router?.query?.users as string;
  const users = usersQuery?.split(",") ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const usersString = users.join(", ");

  return (
    <div>
      <Head>
        <title>Posts: {usersString}</title>
        <meta name="description" content={`dev.to posts ${usersString}}`} />
      </Head>

      <div className="max-w-xl mx-auto sm:overflow-x-hidden">
        {blogPosts[currentIndex]?.map((post) => (
          <div key={post.id} className="mb-4">
            {post.cover_image && (
              <div className="relative max-w-xl h-64">
                <Image src={post.cover_image} alt={post.title} layout="fill" />
              </div>
            )}
            <div className="py-2 px-2">
              <div>
                {post.tag_list.map((tag) => (
                  <a
                    key={tag}
                    target="_blank"
                    rel="noopener"
                    href={`https://dev.to/t/${tag}`}
                    className="mr-2"
                  >
                    #<span className="text-gray-900">{tag}</span>
                  </a>
                ))}
              </div>
              <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                {post.title}
              </h1>

              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                {post.description}
              </p>
              <a
                target="_blank"
                rel="noopener"
                className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                href={post.url}
              >
                Read full story
              </a>
            </div>
          </div>
        ))}
        <ul className="w-full overflow-x-scroll flex space-x-6 px-2 sticky bottom-0 bg-white z-50">
          {users.map((user, index) => (
            <li
              key={user}
              className={`py-2 ${
                currentIndex === index
                  ? "border-t-4 border-indigo-600"
                  : "border-t-4 border-transparent"
              } `}
            >
              <a
                href="/"
                className="text-center"
                onClick={(evt) => {
                  evt.preventDefault();
                  setCurrentIndex(index);
                }}
              >
                {user}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;
