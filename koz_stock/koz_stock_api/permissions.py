from rest_framework.permissions import BasePermission

class IsSuperStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superstaff)

class IsStockStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_stockstaff)

class IsAccountingStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_accountingstaff)

class IsSuperStaffOrAccountingStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superstaff or request.user.is_accountingstaff

class IsSuperStaffOrStockStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superstaff or request.user.is_stockstaff