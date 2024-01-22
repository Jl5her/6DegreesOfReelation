export function getYear(release_date: string | undefined): number | undefined {
  return release_date ? parseInt(release_date.split('-')[0]) : undefined;
}

export function getPosterPath(poster_path: string) {
  return 'https://image.tmdb.org/t/p/w500' + poster_path
}


export function copyMessage(val: string) {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}
