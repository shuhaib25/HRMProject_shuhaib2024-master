import { Component,OnInit,OnChanges } from '@angular/core';
import { Item } from '../item';
import { DataService } from '../data.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit{
  items: Item[] = [];
  newItem: Item = { _id: '', Employee_ID: '', First_Name: '', Last_Name:'',Email: '',Phone_Number: '',Date_of_Birth:'',Address:'',Department:'',Position_Job_Title:'',Date_Hired:'',Salary:''};
  editableItemId: string | null = null;
  isEditMode: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.dataService.getItems().subscribe(items => {
      this.items = items.filter(item => !!item._id);
    });
  }

  editOrUpdateItem(): void {
    if (this.isEditMode) {
      this.dataService.updateItem(this.newItem._id, this.newItem)
        .subscribe(updatedItem => {
          const index = this.items.findIndex(i => i._id === updatedItem._id);
          if (index !== -1) {
            this.items[index] = updatedItem;
          } else {
            console.error('Item not found in items array');
          }
          this.resetForm();
          this.isEditMode = false;
        }, error => {
          console.error('Error updating item:', error);
        });
    } else {
      if (!this.newItem._id) {
        this.newItem._id = this.generateRandomId();
      }

      this.dataService.createItem(this.newItem)
        .subscribe(item => {
          this.items.push(item);
          this.resetForm();
        });
    }
  }

  deleteItem(id: string): void {
    this.dataService.deleteItem(id)
      .subscribe(() => {
        const index = this.items.findIndex(i => i._id === id);
        this.items.splice(index, 1);
      });
  }

  editItem(item: Item): void {
    this.isEditMode = true;
    this.newItem = { ...item }; // Copy the item to newItem
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditMode = false;
  }

  resetForm(): void {
    this.newItem = { _id: '', Employee_ID: '', First_Name: '', Last_Name:'',Email:'',Phone_Number:'',Date_of_Birth:'',Address:'',Department:'',Position_Job_Title:'',Date_Hired:'',Salary:'' };
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }




  

}
