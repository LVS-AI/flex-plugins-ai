namespace LVS.Maui.App;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        // Register detail routes for navigation
        // Note: Login route is already defined in XAML (ShellContent Route="Login")
        Routing.RegisterRoute("CaseHome", typeof(Views.CaseHomePage));
        Routing.RegisterRoute("ContactDetails", typeof(Views.ContactFormPage));
    }
}
