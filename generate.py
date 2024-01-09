from tmdb import TMDB
import random

API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZlZDgzNDI3NjkzYWIwMjZhMTZhMjhiMDIwY2QxNCIsInN1YiI6IjYwYzgyZGYyNDgzMzNhMDA0MWJkYzBjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7HIjQvsvJmUfAQQBPlBJ2l9aDYoAOqDCufWsi8teRnM"

DEFAULT_PAGE_SIZE = 20
RANDOM_MOVIE_POPULARITY_LIMIT = 50

tmdb = TMDB(API_KEY)

def get_year(self, movie_obj):
    if movie_obj['release_date'] == '':
        return -1

    try:
        return int(movie_obj['release_date'].split('-'))[0]
    except:
        print(f"Error occurred getting year for {movie_obj['release_date']}")
        print(movie_obj)

# def get_appearances(person_id):
#     cast = []
#     for page in range(3):
#         cast.extend(get_casting_credits(person_id, page))
#
#     cast = filter(lambda movie: movie['popularity'] > 80, cast)
def get_random_movie(self):
    movies = []

    for page in range(10):
        m = self.get_top_rated_movies(page)
        movies.extend(m)

    print(f"Get {len(movies)} movie(s)")

    movies = list(filter(self.check_movie, movies))
    print(f"{len(movies)} qualifying movie(s)")

    return random.choice(movies)

def is_good_movie(movie):
    return (not movie['adult']
            and movie['popularity'] > 70
            and get_year(movie) >= 1980
            and movie['original_language'] == 'en')


def is_star(c):
    return c['popularity'] > 70


def has_stars(movie):
    return len(list(filter(is_star, get_movie_cast(movie)))) > 2


def check_movie(movie):
    return is_good_movie(movie) and has_stars(movie)


random_movie, cast = get_random_movie()

print("\nRandom Movie:")
print(f"{random_movie['title']} ({get_year(random_movie)})")
print(random_movie)

cast = get_movie_cast(random_movie)
cast = list(filter(is_star, cast))
print([c['name'] for c in cast])


# print("\nMovie Credits")
# random_movie_cast = get_movie_credits(random_movie)
#
# print(random_movie_cast)
# top_rated_cast = list(filter(lambda cast: cast['popularity'] > 70, random_movie_cast))
#
# print(f"Top Rated Cast: {len(top_rated_cast)}")
#
# print([credit['name'] for credit in top_rated_cast])
#
# random_credit = random.choice(top_rated_cast)
# print("\nRandom Credit")
# print(random_credit['name'])
