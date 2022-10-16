export const ITEMS_PER_PAGE = 20;
export const ASC = 'asc';
export const DESC = 'desc';
export const SORT = 'sort';


export interface PaginationUtil {
  itemsPerPage: number;
  sort: string;
  order: string;
  activePage: number;
}


export const getSortState = (
  location: { search: string },
  itemsPerPage: number,
  sortField = 'id',
  sortOrder = 'desc'
): PaginationUtil => {
  const pageParam = getUrlParameter('page', location.search);
  const sortParam = getUrlParameter('sort', location.search);
  let sort = sortField;
  let order = sortOrder;
  let activePage = 1;
  if (pageParam !== '' && !isNaN(parseInt(pageParam, 10))) {
    activePage = parseInt(pageParam, 10);
  }
  if (sortParam !== '') {
    sort = sortParam.split(',')[0];
    order = sortParam.split(',')[1];
  }
  return { itemsPerPage, sort, order, activePage };
};

/**
 * Retrieve new data when infinite scrolling
 * @param currentData
 * @param incomingData
 * @param links
 */
export const loadMoreDataWhenScrolled = (currentData: any, incomingData: any, links: any): any => {
  if (links.first === links.last || !currentData.length) {
    return incomingData;
  }
  if (currentData.length >= incomingData.length) {
    return [...currentData, ...incomingData];
  }
  return null;
};

/**
 * Get base path from current window location
 */
export const getBasePath = (): string => window.location.href.split('#')[0];

/**
 * Parse the header link element and return all links inside.
 * @param header header of link
 */
export const parseHeaderForLinks = (header: string): any => {
  if (header.length === 0) {
    throw new Error('input must not be of zero length');
  }

  // Split parts by comma
  const parts: string[] = header.split(',');
  const links: any = {};

  // Parse each part into a named link
  parts.forEach(p => {
    const section: string[] = p.split(';');

    if (section.length !== 2) {
      throw new Error('section could not be split on ";"');
    }

    const url: string = section[0].replace(/<(.*)>/, '$1').trim();
    const queryString: any = {};

    url.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => (queryString[$1] = $3));

    let page: any = queryString.page;

    if (typeof page === 'string') {
      page = parseInt(page, 10);
    }

    const name: string = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = page;
  });
  return links;
};

export const getUrlParameter = (name: string, search: string): string => {
  const url = new URL(`http://localhost${search}`); // using a dummy url for parsing
  return url.searchParams.get(name) || '';
};

export const overridePaginationStateWithQueryParams = (paginationBaseState: PaginationUtil, locationSearch: string) => {
  const params = new URLSearchParams(locationSearch);
  const page = params.get('page');
  const sort = params.get('sort');
  if (page && sort) {
    const sortSplit = sort.split(',');
    paginationBaseState.activePage = +page;
    paginationBaseState.sort = sortSplit[0];
    paginationBaseState.order = sortSplit[1];
  }
  return paginationBaseState;
};