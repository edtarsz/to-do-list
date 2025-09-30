import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {
  private icons: Record<string, string> = {
    trash: `
      <path d="M7.08325 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.91675 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.4584 4.25V14.1667C13.4584 14.5424 13.3092 14.9027 13.0435 15.1684C12.7778 15.4341 12.4175 15.5833 12.0417 15.5833H4.95841C4.58269 15.5833 4.22236 15.4341 3.95668 15.1684C3.691 14.9027 3.54175 14.5424 3.54175 14.1667V4.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2.125 4.25H14.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.66675 4.25002V2.83335C5.66675 2.45763 5.816 2.0973 6.08168 1.83162C6.34736 1.56594 6.70769 1.41669 7.08341 1.41669H9.91675C10.2925 1.41669 10.6528 1.56594 10.9185 1.83162C11.1842 2.0973 11.3334 2.45763 11.3334 2.83335V4.25002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    add: `
      <path d="M4.375 10.5H16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.5 4.375V16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      `,
    note: `
      <path d="M13.4 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12.6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 6H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 10H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 14H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 18H6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21.378 5.62603C21.7763 5.22767 22.0001 4.68739 22.0001 4.12403C22.0001 3.56067 21.7763 3.02038 21.378 2.62203C20.9796 2.22367 20.4393 1.99988 19.876 1.99988C19.3126 1.99988 18.7723 2.22367 18.374 2.62203L13.364 7.63403C13.1262 7.87165 12.9522 8.16536 12.858 8.48803L12.021 11.358C11.9959 11.4441 11.9944 11.5353 12.0166 11.6221C12.0389 11.7089 12.084 11.7882 12.1474 11.8516C12.2108 11.915 12.2901 11.9601 12.3769 11.9824C12.4637 12.0046 12.5549 12.0031 12.641 11.978L15.511 11.141C15.8336 11.0468 16.1274 10.8728 16.365 10.635L21.378 5.62603Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>    
      `,
    calendar: `
      <path d="M8 2V6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2V6" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10H21" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 14H8.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 14H12.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 14H16.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 18H8.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 18H12.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 18H16.01" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    `
  };

  getIcon(name: string): string {
    return this.icons[name] || '';
  }
}
