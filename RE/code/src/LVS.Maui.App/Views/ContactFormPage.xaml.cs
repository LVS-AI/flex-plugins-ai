using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class ContactFormPage : ContentPage
{
    public ContactFormPage(ContactFormViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
        ShowTab(0);
    }

    private void ShowTab(int index)
    {
        CallerInfoTab.IsVisible = index == 0;
        ChildInfoTab.IsVisible = index == 1;
        CaseInfoTab.IsVisible = index == 2;
        CategoriesTab.IsVisible = index == 3;
    }

    private void OnCallerTabClicked(object? sender, EventArgs e) => ShowTab(0);
    private void OnChildTabClicked(object? sender, EventArgs e) => ShowTab(1);
    private void OnCaseInfoTabClicked(object? sender, EventArgs e) => ShowTab(2);
    private void OnCategoriesTabClicked(object? sender, EventArgs e) => ShowTab(3);
}
