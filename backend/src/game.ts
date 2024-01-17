import type { Cast, Movie, Solution } from "reel-ation";
import { discoverMovies, movieCredits } from "./tmdb.ts";
import { randomChoice, shuffle } from "./utils.ts";

export const checkAnswer = async (movie1: number, movie2: number) => {
  const credits1 = await movieCredits(movie1);
  const credits2 = await movieCredits(movie2);

  const common = credits1.filter(
    (c1) => credits2.find((c2) => c2.name == c1.name) != undefined
  );
  return { correct: common.length > 0, cast: common };
};

export const checkCredit = async (movieId: number, castId: number) => {
  const credits = await movieCredits(movieId);
  return credits?.find((c) => c.id == castId) !== undefined;
};

export const randomMovie = async (include_animation: boolean) => {
  const movie = randomChoice(await filteredTopMovies(include_animation));
  return { movie, cast: await getTopCast(movie.id) };
};

const getTopAppearances = async (
  include_animation: boolean,
  castId: number
): Promise<Movie[]> => {
  const pages = Array.from({ length: 3 }, (_, index) =>
    discoverMovies(include_animation, {
      with_cast: `${castId}`,
      page: `${index + 1}`,
    })
  );

  return (await Promise.all(pages)).flat();
};

const getTopCast = async (movieId: number): Promise<Cast[] | undefined> => {
  const cast = await movieCredits(movieId);
  return cast?.filter((c) => c.popularity > 40);
};

const filteredTopMovies = async (include_animation: boolean): Promise<Movie[]> => {
  return (await getTopMovies(include_animation)).filter(async (movie) => {
    const r = await getTopCast(movie.id);
    return r !== undefined && r.length >= 3;
  });
};

const getTopMovies = async (include_animation: boolean) => {
  const pages = Array.from({ length: 10 }, (_, index) =>
    discoverMovies(include_animation, { page: `${index + 1}` })
  );

  return (await Promise.all(pages)).flat();
};

export const makeSolution = async (
  include_animation: boolean
): Promise<Solution | undefined> => {
  let movies = shuffle(await filteredTopMovies(include_animation));

  const previous_cast: string[] = [];
  const previous_movies: string[] = [];

  for (let firstMovie of movies) {
    console.log(
      `Starting with ${firstMovie.title} (${previous_movies.join(",")})`
    );
    previous_movies.push(firstMovie.id.toString());

    const firstMovieCast = shuffle(await getTopCast(firstMovie.id));
    for (let firstCastMember of firstMovieCast) {
      const firstCastMovies = shuffle(
        await getTopAppearances(include_animation, firstCastMember.id)
      ).filter((movie) => !previous_movies.includes(movie.id.toString()));

      if (firstCastMovies.length < 3) continue;
      console.log(
        `Going with ${firstCastMember.name} (${previous_cast.join(",")})`
      );
      previous_cast.push(firstCastMember.id.toString());

      // Second iteration
      for (let secondMovie of firstCastMovies) {
        console.log(
          `Trying 2nd movie: ${secondMovie.title} (${previous_movies.join(
            ","
          )})`
        );
        previous_movies.push(secondMovie.id.toString());

        const secondMovieCast = shuffle(
          await getTopCast(secondMovie.id)
        ).filter((cast) => !previous_cast.includes(cast.id.toString()));

        for (let secondCastMember of secondMovieCast) {
          const secondCastMovies = shuffle(
            await getTopAppearances(include_animation, secondCastMember.id)
          ).filter((movie) => !previous_movies.includes(movie.id.toString()));

          if (secondCastMovies.length < 3) continue;
          console.log(
            `Going with ${
              secondCastMember.name
            } for second (${previous_cast.join(",")})`
          );
          previous_cast.push(secondCastMember.id.toString());

          // Third iteration
          for (let thirdMovie of secondCastMovies) {
            console.log(
              `Trying 3rd movie: ${thirdMovie.title} (${previous_movies.join(
                ","
              )})`
            );
            previous_movies.push(thirdMovie.id.toString());

            const thirdMovieCast = shuffle(
              await getTopCast(thirdMovie.id)
            ).filter((cast) => !previous_cast.includes(cast.id.toString()));

            for (let thirdCastMember of thirdMovieCast) {
              const thirdCastMovies = shuffle(
                await getTopAppearances(include_animation, thirdCastMember.id)
              ).filter(
                (movie) => !previous_movies.includes(movie.id.toString())
              );

              if (thirdCastMovies.length < 3) continue;
              console.log(
                `Going with ${
                  thirdCastMember.name
                } for third (${previous_cast.join(",")})`
              );
              previous_cast.push(thirdCastMember.id.toString());

              // Fourth iteration
              for (let fourthMovie of thirdCastMovies) {
                console.log(
                  `Trying 4th movie: ${
                    fourthMovie.title
                  } (${previous_movies.join(",")})`
                );
                previous_movies.push(fourthMovie.id.toString());

                const fourthMovieCast = shuffle(await getTopCast(fourthMovie.id))
                   .filter(cast => !previous_cast.includes(cast.id.toString()))

                for (let fourthCastMember of fourthMovieCast) {
                  const fourthCastMovies = shuffle(await getTopAppearances(include_animation, fourthCastMember.id))
                    .filter(movie => !previous_movies.includes(movie.id.toString()))

                  if (fourthCastMovies.length < 3) continue;
                  console.log(`Going with ${fourthCastMember.name} for fourth (${previous_cast.join(",")})`)
                  previous_cast.push(fourthCastMember.id.toString())

                  // Fifth iteration
                  for (let fifthMovie of fourthCastMovies) {
                    console.log(`Trying 5th movie: ${fifthMovie.title} (${previous_movies.join(",")})`)
                    previous_movies.push(fifthMovie.id.toString())

                    const fifthMovieCast = shuffle(await getTopCast(fifthMovie.id))
                    .filter(cast => !previous_cast.includes(cast.id.toString()))

                    for (let fifthCastMember of fifthMovieCast) {
                      const fifthCastMovies = shuffle(await getTopAppearances(include_animation, fifthCastMember.id))
                        .filter(movie => !previous_movies.includes(movie.id.toString()))

                      if (fifthCastMovies.length < 3) continue;

                      // Sixth iteration
                      console.log("Finished!");
                      return [
                        { movie: firstMovie, cast: undefined },
                        { movie: secondMovie, cast: firstCastMember },
                        { movie: thirdMovie, cast: secondCastMember },
                        { movie: fourthMovie, cast: thirdCastMember },
                        { movie: fifthMovie, cast: fourthCastMember },
                        {
                          movie: randomChoice(fifthCastMovies),
                          cast: fifthCastMember,
                        },
                      ];
                    }
                    previous_movies.pop()
                  }
                  previous_cast.pop();
                }
                previous_movies.pop()
              }
              previous_cast.pop();
            }
            previous_movies.pop()
          }
          previous_cast.pop();
        }
        previous_movies.pop();
      }
      previous_cast.pop();
    }
    previous_movies.pop()
  }
}
