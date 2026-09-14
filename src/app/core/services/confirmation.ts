import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  confirmUpdate(itemLabel: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirm update',
      text: `Are you sure you want to update ${itemLabel}?`,
      confirmButtonText: 'Yes, update',
      icon: 'question'
    });
  }

  confirmDelete(itemLabel: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirm deletion',
      text: `Are you sure you want to delete ${itemLabel}? This cannot be undone.`,
      confirmButtonText: 'Yes, delete',
      icon: 'warning'
    });
  }

  private confirm(options: {
    title: string;
    text: string;
    confirmButtonText: string;
    icon: 'question' | 'warning';
  }): Promise<boolean> {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: options.icon === 'warning' ? '#d33' : undefined,
      reverseButtons: true
    }).then(result => result.isConfirmed);
  }
}
