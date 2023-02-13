import { ofetch } from 'ofetch';

const apiFetch = ofetch.create({
  baseURL: 'https://api.github.com/users/unjs'
});

export default {
  getRepos(page, per_page) {
    const fetchOption = {
      query: {
        page,
        per_page,
      },
    };
    return apiFetch('/repos', fetchOption)
  },
}