import { Injectable } from '@angular/core';

interface Icon {
  svg: string;
  viewBox: string;
  size: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {
  private icons: Record<string, Icon> = {
    trash: {
      svg: `<path d="M7.08325 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.91675 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.4584 4.25V14.1667C13.4584 14.5424 13.3092 14.9027 13.0435 15.1684C12.7778 15.4341 12.4175 15.5833 12.0417 15.5833H4.95841C4.58269 15.5833 4.22236 15.4341 3.95668 15.1684C3.691 14.9027 3.54175 14.5424 3.54175 14.1667V4.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.125 4.25H14.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66675 4.25002V2.83335C5.66675 2.45763 5.816 2.0973 6.08168 1.83162C6.34736 1.56594 6.70769 1.41669 7.08341 1.41669H9.91675C10.2925 1.41669 10.6528 1.56594 10.9185 1.83162C11.1842 2.0973 11.3334 2.45763 11.3334 2.83335V4.25002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24',
    },
    add: {
      svg: `<path d="M4.375 10.5H16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.5 4.375V16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24',
    },
    note: {
      svg: `
      <path d="M13.4 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12.6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 6H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 10H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 14H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 18H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21.378 5.62603C21.7763 5.22767 22.0001 4.68739 22.0001 4.12403C22.0001 3.56067 21.7763 3.02038 21.378 2.62203C20.9796 2.22367 20.4393 1.99988 19.876 1.99988C19.3126 1.99988 18.7723 2.22367 18.374 2.62203L13.364 7.63403C13.1262 7.87165 12.9522 8.16536 12.858 8.48803L12.021 11.358C11.9959 11.4441 11.9944 11.5353 12.0166 11.6221C12.0389 11.7089 12.084 11.7882 12.1474 11.8516C12.2108 11.915 12.2901 11.9601 12.3769 11.9824C12.4637 12.0046 12.5549 12.0031 12.641 11.978L15.511 11.141C15.8336 11.0468 16.1274 10.8728 16.365 10.635L21.378 5.62603Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `,
      viewBox: '0 0 24 24',
      size: '24',
    },
    calendar_today: {
      svg: `<path d="M11 14h1v4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2v4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10h18" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 2v4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    calendar_next: {
      svg: `<path d="M8 2v4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2v4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10h18" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 22v-4a2 2 0 0 1 2-2h4" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    calendar: {
      svg: `<path d="M8 2V6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2V6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 4H5C3.895 4 3 4.895 3 6v14c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10H21" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 14H8.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 14H12.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 14H16.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 18H8.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 18H12.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 18H16.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    close: {
      svg: `<path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    send: {
      svg: `<path d="M14.536 22.186c.038.095.104.176.189.232a.43.43 0 0 0 .288.082.43.43 0 0 0 .283-.097.43.43 0 0 0 .177-.24l6.5-19a.46.46 0 0 0-.485-.605L2.338 9.027a.46.46 0 0 0-.025.871l7.931 3.18c.251.101.479.251.67.442.191.191.341.419.442.67l3.18 7.996Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21.854 2.647 10.914 13.586" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '20'
    },
    clock: {
      svg: `<path d="M8.333 1.667h3.334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 11.667 12.5 9.167" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 18.333c3.682 0 6.667-2.985 6.667-6.667C16.667 7.985 13.682 5 10 5 6.318 5 3.333 7.985 3.333 11.667c0 3.682 2.985 6.666 6.667 6.666Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 20 20',
      size: '20'
    },
    calendar_clean: {
      svg: `<path d="M8 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect width="18" height="18" x="3" y="4" rx="2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    arrow_list: {
      svg: `<path d="M1 1.5 7 7.5 13 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 14 9',
      size: '14'
    },
    flag: {
      svg: `<path d="M4.5 22.5V4.5c0-.155.036-.308.105-.447a1 1 0 0 1 .395-.353C5.939 2.921 7.202 2.5 8.5 2.5c3 0 5 2 7.333 2 1.333 0 2.356-.267 3.067-.8a.97.97 0 0 1 1.447.8V14.5c0 .155-.036.308-.106.447a1 1 0 0 1-.394.353C19.061 16.079 17.798 16.5 16.5 16.5c-3 0-5-2-8-2-1.476 0-2.9.544-4 1.528" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 24 24',
      size: '24'
    },
    arrow_downwards: {
      svg: `<path d="M1 1.5 6 6.5 11 1.5" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 12 8',
      size: '12'
    },
    arrow_upwards: {
      svg: `<path d="M1 6.5 6 1.5 11 6.5" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 12 8',
      size: '12'
    },
    line: {
      svg: `<path d="M1 1.00006L6 0.999961L11 1.00006" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      viewBox: '0 0 12 2',
      size: '12'
    }
  };

  getIcon(name: string): Icon {
    return this.icons[name];
  }

  // Se podría hacer entidad but this is fine for now
  getMenu() {
    return [
      {
        id: 1,
        name: "Today",
        icon: this.getIcon('calendar_today'),
        viewBox: '0 0 24 24',
        bgColorHover: 'var(--primary-color)',
        showText: true,
        iconSize: '24'
      },
      {
        id: 2,
        name: "Upcoming",
        icon: this.getIcon('calendar_next'),
        viewBox: '0 0 24 24',
        bgColorHover: 'var(--primary-color)',
        showText: true,
        iconSize: '24'
      },
      {
        id: 3,
        name: "Calendar",
        icon: this.getIcon('calendar'),
        viewBox: '0 0 24 24',
        bgColorHover: 'var(--primary-color)',
        showText: true,
        iconSize: '24'
      }
    ]
  }
}
