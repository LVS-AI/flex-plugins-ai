namespace LVS.Maui.App.Controls;

/// <summary>
/// A navigable header with back button and title.
/// Maps to the NavigableContainer React component.
/// </summary>
public class NavigableHeader : ContentView
{
    public static readonly BindableProperty TitleTextProperty =
        BindableProperty.Create(nameof(TitleText), typeof(string), typeof(NavigableHeader),
            propertyChanged: OnTitleChanged);

    public static readonly BindableProperty ShowBackButtonProperty =
        BindableProperty.Create(nameof(ShowBackButton), typeof(bool), typeof(NavigableHeader),
            defaultValue: true);

    public string? TitleText
    {
        get => (string?)GetValue(TitleTextProperty);
        set => SetValue(TitleTextProperty, value);
    }

    public bool ShowBackButton
    {
        get => (bool)GetValue(ShowBackButtonProperty);
        set => SetValue(ShowBackButtonProperty, value);
    }

    private readonly Label _titleLabel;
    private readonly Button _backButton;

    public NavigableHeader()
    {
        _backButton = new Button
        {
            Text = "←",
            FontSize = 18,
            BackgroundColor = Colors.Transparent,
            WidthRequest = 40
        };
        _backButton.Clicked += async (s, e) => await Shell.Current.GoToAsync("..");

        _titleLabel = new Label
        {
            FontSize = 20,
            FontAttributes = FontAttributes.Bold,
            VerticalOptions = LayoutOptions.Center
        };

        var layout = new HorizontalStackLayout { Spacing = 8 };
        layout.Children.Add(_backButton);
        layout.Children.Add(_titleLabel);
        Content = layout;

        UpdateAppearance();
    }

    private static void OnTitleChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is NavigableHeader header)
            header.UpdateAppearance();
    }

    private void UpdateAppearance()
    {
        _titleLabel.Text = TitleText ?? string.Empty;
        _backButton.IsVisible = ShowBackButton;
    }
}
