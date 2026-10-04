import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Category } from './components/category/category';
import { GuardService } from './services/guard.service';
import { Supplier } from './components/supplier/supplier';
import { AddEditSupplier } from './components/add-edit-supplier/add-edit-supplier';
import { Product } from './components/product/product';
import { AddEditProduct } from './components/add-edit-product/add-edit-product';
import { Purchase } from './components/purchase/purchase';
import { Sell } from './components/sell/sell';
import { Transaction } from './components/transaction/transaction';
import { TransactionDetails } from './components/transaction-details/transaction-details';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [

    { path: 'login', component: Login },
    { path: 'register', component: Register },

    { path: 'category', component: Category, canActivate: [GuardService], data: {requiresAdmin: true}},

    { path: 'supplier', component: Supplier, canActivate: [GuardService], data: {requiresAdmin: true}},
    { path: 'edit-supplier/:supplierId', component: AddEditSupplier, canActivate: [GuardService], data: {requiresAdmin: true}},
    { path: 'add-supplier', component: AddEditSupplier, canActivate: [GuardService], data: {requiresAdmin: true}},

    { path: 'product', component: Product, canActivate: [GuardService], data: {requiresAdmin: true}},
    { path: 'edit-product/:productId', component: AddEditProduct, canActivate: [GuardService], data: {requiresAdmin: true}},
    { path: 'add-product', component: AddEditProduct, canActivate: [GuardService], data: {requiresAdmin: true}},

    { path: 'purchase', component: Purchase, canActivate: [GuardService]},
    { path: 'sell', component: Sell, canActivate: [GuardService]},
    { path: 'transaction', component: Transaction, canActivate: [GuardService]},
    { path: 'transaction/:transactionId', component: TransactionDetails, canActivate: [GuardService]},

    { path: 'profile', component: Profile, canActivate: [GuardService]},
    { path: 'dashboard', component: Dashboard, canActivate: [GuardService]},

    { path: "", redirectTo: '/login', pathMatch: 'full' },
    { path: "**", redirectTo: '/dashboard' },
];
