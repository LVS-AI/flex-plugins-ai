using LVS.Core.Models;

namespace LVS.Maui.App.Controls;

/// <summary>
/// Renders a grid of categories/subcategories with checkboxes.
/// Maps to the React CategoryGrid component.
/// Supports maxSelections constraint.
/// </summary>
public class CategoryGrid : ContentView
{
    public static readonly BindableProperty CategoriesDefinitionProperty =
        BindableProperty.Create(
            nameof(CategoriesDefinition),
            typeof(CategoriesDefinition),
            typeof(CategoryGrid),
            propertyChanged: OnDefinitionChanged);

    public static readonly BindableProperty SelectedCategoriesProperty =
        BindableProperty.Create(
            nameof(SelectedCategories),
            typeof(Dictionary<string, List<string>>),
            typeof(CategoryGrid));

    public CategoriesDefinition? CategoriesDefinition
    {
        get => (CategoriesDefinition?)GetValue(CategoriesDefinitionProperty);
        set => SetValue(CategoriesDefinitionProperty, value);
    }

    public Dictionary<string, List<string>>? SelectedCategories
    {
        get => (Dictionary<string, List<string>>?)GetValue(SelectedCategoriesProperty);
        set => SetValue(SelectedCategoriesProperty, value);
    }

    private static void OnDefinitionChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is CategoryGrid grid)
            grid.RenderGrid();
    }

    private int TotalSelections()
    {
        if (SelectedCategories is null) return 0;
        return SelectedCategories.Values.Sum(v => v.Count);
    }

    private void RenderGrid()
    {
        if (CategoriesDefinition?.Categories is null)
        {
            Content = new Label { Text = "No categories defined.", TextColor = Colors.Gray };
            return;
        }

        var mainLayout = new VerticalStackLayout { Spacing = 16 };

        foreach (var (categoryName, categoryEntry) in CategoriesDefinition.Categories)
        {
            var categorySection = new VerticalStackLayout { Spacing = 4 };

            // Category header with color
            var headerColor = Colors.Gray;
            if (!string.IsNullOrEmpty(categoryEntry.Color))
            {
                try { headerColor = Color.Parse(categoryEntry.Color); }
                catch { /* keep default */ }
            }

            categorySection.Children.Add(new Label
            {
                Text = categoryName,
                FontAttributes = FontAttributes.Bold,
                FontSize = 16,
                TextColor = headerColor
            });

            // Subcategories as checkboxes
            foreach (var subcategory in categoryEntry.Subcategories)
            {
                var isChecked = SelectedCategories?.TryGetValue(categoryName, out var subs) == true
                    && subs.Contains(subcategory.Label);

                var row = new HorizontalStackLayout { Spacing = 8 };
                var checkbox = new CheckBox { IsChecked = isChecked };

                var catName = categoryName;
                var subLabel = subcategory.Label;

                checkbox.CheckedChanged += (s, e) =>
                {
                    SelectedCategories ??= new Dictionary<string, List<string>>();
                    if (!SelectedCategories.TryGetValue(catName, out var list))
                    {
                        list = [];
                        SelectedCategories[catName] = list;
                    }

                    if (e.Value)
                    {
                        if (CategoriesDefinition.MaxSelections.HasValue
                            && TotalSelections() >= CategoriesDefinition.MaxSelections.Value)
                        {
                            // Undo: max selections reached
                            if (s is CheckBox cb) cb.IsChecked = false;
                            return;
                        }
                        if (!list.Contains(subLabel))
                            list.Add(subLabel);
                    }
                    else
                    {
                        list.Remove(subLabel);
                    }
                };

                row.Children.Add(checkbox);
                row.Children.Add(new Label
                {
                    Text = subcategory.Label,
                    VerticalOptions = LayoutOptions.Center
                });
                categorySection.Children.Add(row);
            }

            mainLayout.Children.Add(categorySection);
        }

        // Max selections indicator
        if (CategoriesDefinition.MaxSelections.HasValue)
        {
            mainLayout.Children.Insert(0, new Label
            {
                Text = $"Max selections: {CategoriesDefinition.MaxSelections.Value}",
                FontSize = 12,
                TextColor = Colors.Gray
            });
        }

        Content = new ScrollView { Content = mainLayout };
    }
}
