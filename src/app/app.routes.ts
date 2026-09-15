import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { authGuard, roleGuard, overviewGuard, otpGuard, branchGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        // Portal entry point — always land on the login page first.
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(m => m.Login)
    },
    {
        path: 'otp',
        canActivate: [otpGuard],
        loadComponent: () =>
            import('./features/auth/otp/otp')
                .then(m => m.Otp)
    },
    {
        path: 'unauthorized',
        loadComponent: () =>
            import('./features/auth/unauthorized/unauthorized')
                .then(m => m.Unauthorized)
    },
    {
        // ===== Portal =====
        // One shell for every role. HQ sees the combined overview and every
        // admin section; a business-unit role (GENERAL / LIFE / MEDICAL /
        // INVEST) only ever reaches the dashboard for its own unit — a
        // "branch" here means business unit, not a physical location.
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                canActivate: [overviewGuard],
                loadComponent: () =>
                    import('./features/dashboard/overview/overview')
                        .then(m => m.Overview),
                data: {
                    breadcrumb: 'Overview'
                }
            },
            {
                path: 'dashboard/general',
                canActivate: [roleGuard(['HQ', 'GENERAL'])],
                loadComponent: () =>
                    import('./features/dashboard/general/product-performance')
                        .then(m => m.ProductPerformance),
                data: {
                    breadcrumb: 'General'
                }
            },
            {
                path: 'dashboard/business-products',
                canActivate: [roleGuard(['HQ', 'LIFE'])],
                loadComponent: () =>
                    import(
                        './features/dashboard/life/business'
                    ).then(m => m.Business),
                data: {
                    breadcrumb: 'Life'
                }
            },
            {
                path: 'dashboard/health',
                canActivate: [roleGuard(['HQ', 'MEDICAL'])],
                loadComponent: () =>
                    import(
                        './features/dashboard/medical/product-performance'
                    ).then(m => m.ProductPerformance),
                data: {
                    breadcrumb: 'Health'
                }
            },
            {
                path: 'dashboard/investment',
                canActivate: [roleGuard(['HQ', 'INVEST'])],
                loadComponent: () =>
                    import(
                        './features/dashboard/investment/product-performance'
                    ).then(m => m.ProductPerformance),
                data: {
                    breadcrumb: 'Investment'
                }
            },
            {
                // Unit-scoped Products / Transactions for a business-unit
                // dashboard — HQ has its own unscoped equivalents below.
                path: 'dashboard/products',
                canActivate: [roleGuard(['GENERAL', 'LIFE', 'MEDICAL', 'INVEST'])],
                loadComponent: () =>
                    import(
                        './features/unit-products/unit-products'
                    ).then(m => m.UnitProducts),
                data: {
                    breadcrumb: 'Products'
                }
            },
            {
                path: 'dashboard/transactions',
                canActivate: [roleGuard(['GENERAL', 'LIFE', 'MEDICAL', 'INVEST'])],
                loadComponent: () =>
                    import(
                        './features/unit-transactions/unit-transactions'
                    ).then(m => m.UnitTransactions),
                data: {
                    breadcrumb: 'Transactions'
                }
            },
            {
                path: 'channels',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import('./features/dashboard/channel-performance/channel-performance')
                        .then(m => m.ChannelPerformance),
                data: {
                    breadcrumb: 'Channels'
                }
            },
            {
                path: 'transactions',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/transactions/transactions'
                    ).then(m => m.Transactions),
                data: {
                    breadcrumb: 'Transactions'
                }
            },
            {
                path: 'products/personal',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/products/personal/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Personal Products'
                }
            },
            {
                path: 'channelsList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/channels/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Channels Available'
                }
            },
            {
                path: 'branchList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/branch/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Branches Available'
                }
            },
            {
                // Per-branch dashboard — a physical branch's own view of its
                // members and transactions, independent of business-unit role.
                path: 'branches/:slug',
                canActivate: [branchGuard],
                loadComponent: () =>
                    import(
                        './features/branch-dashboard/branch-dashboard'
                    ).then(m => m.BranchDashboard),
                data: {
                    breadcrumb: 'Branch Dashboard'
                }
            },
            {
                path: 'usersList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/users/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Users Available'
                }
            },
            {
                path: 'paybillsList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/finance/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Paybills'
                }
            },
            {
                path: 'paybillAllocateList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/finance/allocate-paybill-list/allocate-paybill-list'
                    ).then(m => m.AllocatePaybillList),
                data: {
                    breadcrumb: 'Allocate Paybills'
                }
            },
            {
                path: 'paybillWithdrawList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/finance/withdraw/withdraw'
                    ).then(m => m.Withdraw),
                data: {
                    breadcrumb: 'Withdraw Paybills'
                }
            },
            {
                path: 'agentsList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/agents/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Agents'
                }
            },
            {
                path: 'membersList',
                canActivate: [roleGuard(['HQ', 'GENERAL', 'LIFE', 'MEDICAL', 'INVEST'])],
                loadComponent: () =>
                    import(
                        './features/members/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Members'
                }
            },
            {
                path: 'profilesList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/profiles/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Profiles'
                }
            },
            {
                path: 'rolesList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/roles/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Roles'
                }
            },
            {
                path: 'permissionsList',
                canActivate: [roleGuard('HQ')],
                loadComponent: () =>
                    import(
                        './features/permissions/list/list'
                    ).then(m => m.List),
                data: {
                    breadcrumb: 'Permissions'
                }
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
