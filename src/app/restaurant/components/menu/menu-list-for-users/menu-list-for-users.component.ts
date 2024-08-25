import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-list-for-users',
  templateUrl: './menu-list-for-users.component.html',
  styleUrl: './menu-list-for-users.component.scss'
})
export class MenuListForUsersComponent {
  menuItems = [
    {
      name: 'Spaghetti Carbonara',
      price: 12.99,
      description: 'Classic Italian pasta with creamy sauce and pancetta.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.zjwlkbRWoRIUP2nLduDtoAHaLI?pid=ImgDet&w=192&h=288&c=7&dpr=1.5'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.zjwlkbRWoRIUP2nLduDtoAHaLI?pid=ImgDet&w=192&h=288&c=7&dpr=1.5'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    // Add more items as needed
  ];

  order(item: any): void {
    // Handle the order logic
    console.log(`Ordered: ${item.name}`);
  }
}
