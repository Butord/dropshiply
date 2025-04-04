
import { useState } from 'react';
import { XMLMapping } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Plus, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface XMLMappingFormProps {
  initialMapping?: XMLMapping;
  onSave: (mapping: XMLMapping) => void;
  onCancel?: () => void;
  sampleXML?: string;
}

export const XMLMappingForm = ({ initialMapping, onSave, onCancel, sampleXML }: XMLMappingFormProps) => {
  const [mapping, setMapping] = useState<XMLMapping>(
    initialMapping || {
      rootElement: '',
      productElement: '',
      fieldMappings: {
        name: '',
        price: '',
      },
      transforms: {},
    }
  );

  const [activeTab, setActiveTab] = useState('basic');
  const [transformField, setTransformField] = useState<string>('');
  const [transformType, setTransformType] = useState<string>('');

  const handleFieldMappingChange = (field: string, value: string) => {
    setMapping({
      ...mapping,
      fieldMappings: {
        ...mapping.fieldMappings,
        [field]: value,
      },
    });
  };

  const handleAddTransform = () => {
    if (!transformField || !transformType) return;

    setMapping({
      ...mapping,
      transforms: {
        ...mapping.transforms,
        [transformField]: {
          type: transformType as any,
          pattern: '',
          replacement: '',
        },
      },
    });

    setTransformField('');
    setTransformType('');
  };

  const handleTransformChange = (field: string, property: string, value: string) => {
    if (!mapping.transforms) return;

    setMapping({
      ...mapping,
      transforms: {
        ...mapping.transforms,
        [field]: {
          ...mapping.transforms[field],
          [property]: value,
        },
      },
    });
  };

  const handleRemoveTransform = (field: string) => {
    if (!mapping.transforms) return;

    const newTransforms = { ...mapping.transforms };
    delete newTransforms[field];

    setMapping({
      ...mapping,
      transforms: newTransforms,
    });
  };

  const handleSave = () => {
    // Basic validation
    if (!mapping.rootElement || !mapping.productElement || !mapping.fieldMappings.name || !mapping.fieldMappings.price) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields (Root Element, Product Element, Name, and Price mappings)",
        variant: "destructive",
      });
      return;
    }

    onSave(mapping);
  };

  const fieldLabels: Record<string, string> = {
    id: 'Product ID',
    name: 'Product Name',
    description: 'Description',
    price: 'Price',
    compareAtPrice: 'Compare-at Price',
    images: 'Images',
    category: 'Category',
    categoryIdToName: 'Category ID to Name Mapping',
    tags: 'Tags',
    sku: 'SKU',
    stock: 'Stock',
  };

  const requiredFields = ['name', 'price'];

  return (
    <div className="space-y-6 p-1">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Mapping</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Fields</TabsTrigger>
          <TabsTrigger value="transforms">Transformations</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="rootElement">XML Root Element</Label>
              <Input
                id="rootElement"
                value={mapping.rootElement}
                onChange={(e) => setMapping({ ...mapping, rootElement: e.target.value })}
                placeholder="e.g. products, items, catalog"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="productElement">Product Element</Label>
              <Input
                id="productElement"
                value={mapping.productElement}
                onChange={(e) => setMapping({ ...mapping, productElement: e.target.value })}
                placeholder="e.g. product, item"
                className="mt-1"
              />
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <Label htmlFor="name" className="flex items-center">
                Product Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={mapping.fieldMappings.name}
                onChange={(e) => handleFieldMappingChange('name', e.target.value)}
                placeholder="e.g. title, name, product_name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="flex items-center">
                Price <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="price"
                value={mapping.fieldMappings.price}
                onChange={(e) => handleFieldMappingChange('price', e.target.value)}
                placeholder="e.g. price, regular_price"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={mapping.fieldMappings.description || ''}
                onChange={(e) => handleFieldMappingChange('description', e.target.value)}
                placeholder="e.g. description, product_description"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="images">Images (comma-separated paths)</Label>
              <Input
                id="images"
                value={mapping.fieldMappings.images || ''}
                onChange={(e) => handleFieldMappingChange('images', e.target.value)}
                placeholder="e.g. image, image_url, images/image"
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="id">Product ID</Label>
              <Input
                id="id"
                value={mapping.fieldMappings.id || ''}
                onChange={(e) => handleFieldMappingChange('id', e.target.value)}
                placeholder="e.g. id, product_id"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="compareAtPrice">Compare-at Price</Label>
              <Input
                id="compareAtPrice"
                value={mapping.fieldMappings.compareAtPrice || ''}
                onChange={(e) => handleFieldMappingChange('compareAtPrice', e.target.value)}
                placeholder="e.g. compare_price, list_price"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={mapping.fieldMappings.category || ''}
                onChange={(e) => handleFieldMappingChange('category', e.target.value)}
                placeholder="e.g. category, product_type"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="categoryIdToName">Category ID to Name Mapping</Label>
              <Input
                id="categoryIdToName"
                value={mapping.fieldMappings.categoryIdToName || ''}
                onChange={(e) => handleFieldMappingChange('categoryIdToName', e.target.value)}
                placeholder="e.g. categories/category"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this when your XML has category IDs that need to be mapped to category names
              </p>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={mapping.fieldMappings.tags || ''}
                onChange={(e) => handleFieldMappingChange('tags', e.target.value)}
                placeholder="e.g. tags, keywords"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={mapping.fieldMappings.sku || ''}
                onChange={(e) => handleFieldMappingChange('sku', e.target.value)}
                placeholder="e.g. sku, article, product_code"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                value={mapping.fieldMappings.stock || ''}
                onChange={(e) => handleFieldMappingChange('stock', e.target.value)}
                placeholder="e.g. stock, inventory, quantity"
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transforms" className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-4 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Transformations allow you to clean and format values from XML. For example, removing currency symbols from prices or splitting comma-separated tags.
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <div className="flex-1">
              <Select value={transformField} onValueChange={setTransformField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fieldLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={transformType} onValueChange={setTransformType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transform type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regex">Regex Replace</SelectItem>
                  <SelectItem value="replace">Simple Replace</SelectItem>
                  <SelectItem value="split">Split Text</SelectItem>
                  <SelectItem value="join">Join Array</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddTransform} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {mapping.transforms && Object.entries(mapping.transforms).map(([field, transform]) => (
              <div key={field} className="bg-background border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{fieldLabels[field] || field}</h4>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTransform(field)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {transform.type === 'regex' && (
                    <>
                      <div>
                        <Label>Pattern (regex)</Label>
                        <Input
                          value={transform.pattern || ''}
                          onChange={(e) => handleTransformChange(field, 'pattern', e.target.value)}
                          placeholder="e.g. [^0-9.]"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Replacement</Label>
                        <Input
                          value={transform.replacement || ''}
                          onChange={(e) => handleTransformChange(field, 'replacement', e.target.value)}
                          placeholder="e.g. (empty for removal)"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {transform.type === 'replace' && (
                    <>
                      <div>
                        <Label>Search Text</Label>
                        <Input
                          value={transform.pattern || ''}
                          onChange={(e) => handleTransformChange(field, 'pattern', e.target.value)}
                          placeholder="e.g. $"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Replacement</Label>
                        <Input
                          value={transform.replacement || ''}
                          onChange={(e) => handleTransformChange(field, 'replacement', e.target.value)}
                          placeholder="e.g. (empty for removal)"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {transform.type === 'split' && (
                    <div>
                      <Label>Separator</Label>
                      <Input
                        value={transform.separator || ''}
                        onChange={(e) => handleTransformChange(field, 'separator', e.target.value)}
                        placeholder="e.g. , or |"
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {transform.type === 'join' && (
                    <div>
                      <Label>Separator</Label>
                      <Input
                        value={transform.separator || ''}
                        onChange={(e) => handleTransformChange(field, 'separator', e.target.value)}
                        placeholder="e.g. , or |"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {mapping.transforms && Object.keys(mapping.transforms).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transformations added yet
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Mapping
        </Button>
      </div>
    </div>
  );
};

export default XMLMappingForm;
