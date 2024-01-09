from tmdbv3api import TMDb, Discover, Movie
import random

tmdb = TMDb()
tmdb.api_key = "006ed83427693ab026a16a28b020cd14"

discover = Discover()
movie = Movie()

filters = {
    'primary_release_date.gte': '1980-01-01',
    'primary_release_date.lte': '2020-01-01',
    'sort_by': 'popularity.desc',
    'certification_country': 'US',
    'vote_count.gte': 1000,
    'vote_average.gte': 7
}


def get_top():
    movies = []
    for page in range(10):
        movies.extend(discover.discover_movies({
            **filters,
            'page': page + 1
        }))

    return movies


def get_top_appearances(cast_id):
    movies = []
    for page in range(3):
        movies.extend(discover.discover_movies({
            **filters,
            'with_cast': cast_id
        }))

    return movies


def get_top_cast(movie_id):
    cast = movie.credits(movie_id)['cast']
    return list(filter(lambda c: c['popularity'] > 40, cast))


def filtered_top():
    return list(filter(lambda m: len(get_top_cast(m['id'])) >= 3, get_top()))


def make_game():
    movies = filtered_top()
    print(f"Got {len(movies)} movie(s)")
    movie = random.choice(movies)

    previous_movie = [movie['id']]
    previous_cast = []

    print(f"Starting with {movie['title']}")

    for _ in range(7):
        top_cast = get_top_cast(movie['id'])
        while True:
            cast = random.choice(top_cast)
            while cast['id'] in previous_cast:
                cast = random.choice(top_cast)
            print(f"  Trying {cast['name']}...")

            movies = get_top_appearances(cast['id'])

            movie = random.choice(movies)
            while movie['id'] in previous_movie:
                movie = random.choice(movies)

            previous_movie.append(movie['id'])
            previous_cast.append(cast['id'])
            break

        print(f"Moving on with {cast['name']}")
        print(f"Moving on with {movie['title']}")
        print()


make_game()
print("Done")