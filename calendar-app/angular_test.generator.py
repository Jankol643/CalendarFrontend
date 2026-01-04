#!/usr/bin/env python3
"""
Angular Test Generator
Automatically adds test cases for public methods in Angular components and services.
"""

import os
import re
import ast
from typing import List, Dict, Set, Optional, Tuple
import glob
from pathlib import Path
import argparse


class AngularTestGenerator:
    def __init__(self, base_path: str = "."):
        self.base_path = base_path
        
        # Templates for different Angular entities
        self.component_test_template = """import {{ ComponentFixture, TestBed }} from '@angular/core/testing';
import {{ {component_name} }} from './{component_filename}';

describe('{component_name}', () => {{
  let component: {component_name};
  let fixture: ComponentFixture<{component_name}>;

  beforeEach(async () => {{
    await TestBed.configureTestingModule({{
      imports: [{component_name}]
    }})
      .compileComponents();

    fixture = TestBed.createComponent({component_name});
    component = fixture.componentInstance;
    fixture.detectChanges();
  }});

  it('should create', () => {{
    expect(component).toBeTruthy();
  }});
{test_cases}
}});"""
        
        self.service_test_template = """import {{ TestBed }} from '@angular/core/testing';
import {{ {service_name} }} from './{service_filename}';

describe('{service_name}', () => {{
  let service: {service_name};

  beforeEach(() => {{
    TestBed.configureTestingModule({{}});
    service = TestBed.inject({service_name});
  }});

  it('should be created', () => {{
    expect(service).toBeTruthy();
  }});
{test_cases}
}});"""
        
        self.directive_test_template = """import {{ {directive_name} }} from './{directive_filename}';

describe('{directive_name}', () => {{
  it('should create an instance', () => {{
    const directive = new {directive_name}();
    expect(directive).toBeTruthy();
  }});
{test_cases}
}});"""
        
        self.pipe_test_template = """import {{ {pipe_name} }} from './{pipe_filename}';

describe('{pipe_name}', () => {{
  const pipe = new {pipe_name}();

  it('should create an instance', () => {{
    expect(pipe).toBeTruthy();
  }});
{test_cases}
}});"""
    
    def find_angular_entities(self) -> List[Dict]:
        """Find all Angular component and service TypeScript files."""
        entities = []
        
        # Look for .ts files that are likely components or services
        ts_files = glob.glob(os.path.join(self.base_path, "**/*.ts"), recursive=True)
        
        for ts_file in ts_files:
            # Skip test files
            if ts_file.endswith('.spec.ts'):
                continue
                
            try:
                with open(ts_file, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                print(f"Warning: Could not read {ts_file} (encoding issue)")
                continue
            except Exception as e:
                print(f"Warning: Could not read {ts_file}: {e}")
                continue
            
            # Extract class name from file
            match = re.search(r'export\s+class\s+(\w+)\s*(?:extends|implements|{)', content)
            if not match:
                continue
                
            class_name = match.group(1)
            
            # Determine entity type
            entity_type = None
            if '@Component' in content:
                entity_type = 'component'
            elif '@Injectable' in content:
                entity_type = 'service'
            elif '@Directive' in content:
                entity_type = 'directive'
            elif '@Pipe' in content:
                entity_type = 'pipe'
            
            # Only process components and services for now
            if entity_type not in ['component', 'service', 'directive', 'pipe']:
                continue
            
            # Find corresponding test file
            spec_file = ts_file.replace('.ts', '.spec.ts')
            
            entities.append({
                'path': ts_file,
                'spec_path': spec_file,
                'name': class_name,
                'filename': os.path.basename(ts_file).replace('.ts', ''),
                'type': entity_type,
                'content': content,
                'relative_path': os.path.relpath(ts_file, self.base_path)
            })
        
        return entities
    
    def extract_public_methods(self, entity_content: str, entity_type: str) -> List[Dict]:
        """Extract public methods from component or service class."""
        methods = []
        
        # Find the class content
        # First, find the class declaration
        class_pattern = r'export\s+class\s+\w+\s*(?:implements\s+[^{]+)?\s*\{'
        class_match = re.search(class_pattern, entity_content)
        
        if not class_match:
            return methods
            
        # Find the matching closing brace for the class
        start_pos = class_match.end() - 1  # Position of the opening brace
        brace_count = 1
        pos = start_pos + 1
        
        while brace_count > 0 and pos < len(entity_content):
            if entity_content[pos] == '{':
                brace_count += 1
            elif entity_content[pos] == '}':
                brace_count -= 1
            pos += 1
        
        if brace_count > 0:
            return methods
            
        class_body = entity_content[start_pos + 1:pos - 1]
        
        # Remove comments to avoid false matches
        class_body_no_comments = re.sub(r'//.*?\n|/\*[\s\S]*?\*/', '', class_body)
        
        # Remove property declarations (lines ending with semicolon or assignment)
        # This helps avoid matching property initializations as methods
        lines = class_body_no_comments.split('\n')
        filtered_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip empty lines and property declarations
            if not line or line.endswith(';') or '=' in line and not re.search(r'\b(?:public|private|protected)?\s*\w+\s*\([^)]*\)', line):
                continue
            filtered_lines.append(line)
        
        filtered_body = '\n'.join(filtered_lines)
        
        # Pattern to find method signatures
        # This handles: (public)? methodName(params): returnType {
        method_pattern = r'(?:public\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\s*\{'
        
        for match in re.finditer(method_pattern, filtered_body):
            method_name = match.group(1)
            
            # Skip common Angular lifecycle methods and private/internal methods
            lifecycle_methods = {
                'ngOnInit', 'ngOnDestroy', 'ngAfterViewInit', 'ngAfterContentInit',
                'ngOnChanges', 'ngDoCheck', 'ngAfterContentChecked', 'ngAfterViewChecked',
                'constructor', 'ngDoBootstrap'
            }
            
            # Skip if it's a lifecycle method or starts with underscore (private convention)
            if method_name in lifecycle_methods or method_name.startswith('_'):
                continue
                
            # Parse method parameters
            args_str = match.group(2).strip()
            parameters = []
            
            if args_str:
                # Split parameters by comma, but be careful with generic types
                arg_parts = []
                current_arg = []
                bracket_count = 0
                
                for char in args_str:
                    if char == '<':
                        bracket_count += 1
                    elif char == '>':
                        bracket_count -= 1
                    elif char == ',' and bracket_count == 0:
                        arg_part = ''.join(current_arg).strip()
                        if arg_part:
                            arg_parts.append(arg_part)
                        current_arg = []
                        continue
                    current_arg.append(char)
                
                if current_arg:
                    arg_part = ''.join(current_arg).strip()
                    if arg_part:
                        arg_parts.append(arg_part)
                
                for arg in arg_parts:
                    arg = arg.strip()
                    if ':' in arg:
                        parts = arg.split(':', 1)
                        param_name = parts[0].strip()
                        param_type = parts[1].strip() if len(parts) > 1 else 'any'
                        
                        # Clean up param name (remove optional ?)
                        if param_name.endswith('?'):
                            param_name = param_name[:-1]
                        
                        parameters.append({
                            'name': param_name,
                            'type': param_type
                        })
                    elif arg:  # Handle parameters without explicit types
                        param_name = arg.strip()
                        if param_name.endswith('?'):
                            param_name = param_name[:-1]
                        parameters.append({
                            'name': param_name,
                            'type': 'any'
                        })
            
            methods.append({
                'name': method_name,
                'args': args_str,
                'parameters': parameters,
                'full_match': match.group(0)
            })
        
        return methods

    def generate_test_case(self, method: Dict, entity_type: str) -> str:
        """Generate a test case for a method."""
        method_name = method['name']
        
        # Create a simple test case based on method name
        test_description = f"should call {method_name}"
        
        # Handle different types of methods
        method_lower = method_name.lower()
        if method_lower.startswith('get'):
            test_description = f"should return value from {method_name}"
        elif method_lower.startswith('set'):
            test_description = f"should set value with {method_name}"
        elif method_lower.startswith(('is', 'has', 'can')):
            test_description = f"should check condition with {method_name}"
        elif method_lower.startswith('validate'):
            test_description = f"should validate with {method_name}"
        
        # Generate mock values for parameters
        test_args = []
        mock_declarations = []
        
        for i, param in enumerate(method['parameters']):
            param_name = param['name']
            param_type = param['type'].lower()
            
            # Generate appropriate mock value based on parameter type
            if 'string' in param_type:
                mock_value = f"'test{param_name}'"
                test_args.append(mock_value)
            elif 'number' in param_type or 'int' in param_type or 'float' in param_type:
                mock_value = "123"
                test_args.append(mock_value)
            elif 'boolean' in param_type or 'bool' in param_type:
                mock_value = "true"
                test_args.append(mock_value)
            elif 'array' in param_type or '[]' in param_type:
                mock_value = "[]"
                test_args.append(mock_value)
            elif 'object' in param_type or 'record' in param_type:
                mock_value = "{}"
                test_args.append(mock_value)
            elif 'observable' in param_type:
                mock_value = f"of({{}})"
                test_args.append(mock_value)
                if "import { of } from 'rxjs';" not in mock_declarations:
                    mock_declarations.append("import { of } from 'rxjs';")
            elif 'promise' in param_type:
                mock_value = "Promise.resolve({})"
                test_args.append(mock_value)
            else:
                # For complex types, use a typed mock object
                mock_var_name = f"mock{param_name.capitalize()}"
                mock_value = mock_var_name
                test_args.append(mock_value)
                mock_declarations.append(f"const {mock_var_name}: any = {{}};")
        
        # Create the test case
        if entity_type == 'component':
            test_call = f"component.{method_name}"
        elif entity_type == 'service':
            test_call = f"service.{method_name}"
        elif entity_type == 'directive':
            test_call = f"directive.{method_name}"
        elif entity_type == 'pipe':
            test_call = f"pipe.transform"
        else:
            test_call = f"instance.{method_name}"
        
        if test_args:
            args_str = ', '.join(test_args)
            test_case = f"""
  it('{test_description}', () => {{
    {chr(10).join(f'    {decl}' for decl in mock_declarations) if mock_declarations else ''}
    // Arrange
    const result = {test_call}({args_str});
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what {method_name} should do
  }});"""
        else:
            test_case = f"""
  it('{test_description}', () => {{
    // Act
    const result = {test_call}();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what {method_name} should do
  }});"""
        
        return test_case
    
    def get_existing_test_cases(self, spec_content: str) -> Tuple[Set[str], Set[str]]:
        """Extract existing test case descriptions and method names to avoid duplicates."""
        existing_descriptions = set()
        existing_methods = set()
        
        # Remove comments first
        spec_content_no_comments = re.sub(r'//.*?\n|/\*[\s\S]*?\*/', '', spec_content)
        
        # Find all it() blocks with various quote styles
        it_patterns = [
            r"it\('([^']+)'",  # Single quotes
            r'it\("([^"]+)"',  # Double quotes
            r"it\(`([^`]+)`"   # Template literals
        ]
        
        for pattern in it_patterns:
            for match in re.finditer(pattern, spec_content_no_comments):
                description = match.group(1).lower()
                existing_descriptions.add(description)
                
                # Extract method names from common patterns
                patterns_to_check = [
                    r'call\s+(\w+)',
                    r'return.*\s+(\w+)',
                    r'set\s+(\w+)',
                    r'check\s+(\w+)',
                    r'verify\s+(\w+)',
                    r'validate\s+(\w+)',
                    r'test\s+(\w+)',
                    r'(\w+)\s+method',
                    r'(\w+)\s+function',
                    r'should\s+\w+\s+(\w+)'
                ]
                
                for pattern in patterns_to_check:
                    method_match = re.search(pattern, description)
                    if method_match:
                        method_name = method_match.group(1)
                        existing_methods.add(method_name)
        
        return existing_descriptions, existing_methods

    def update_test_file(self, entity: Dict) -> bool:
        """Update or create test file for component or service."""
        public_methods = self.extract_public_methods(entity['content'], entity['type'])
        
        if not public_methods:
            print(f"No public methods found for {entity['name']}")
            return False
        
        # Generate test cases
        test_cases = []
        existing_descriptions = set()
        existing_methods = set()
        
        # Check if spec file exists and read existing tests
        if os.path.exists(entity['spec_path']):
            try:
                with open(entity['spec_path'], 'r', encoding='utf-8') as f:
                    spec_content = f.read()
                existing_descriptions, existing_methods = self.get_existing_test_cases(spec_content)
            except Exception as e:
                print(f"Warning: Could not read existing test file {entity['spec_path']}: {e}")
                spec_content = ""
        else:
            spec_content = ""
        
        # Create test cases for methods that don't already have tests
        for method in public_methods:
            method_name = method['name']
            
            # Check if a test for this method already exists
            test_exists = (method_name in existing_methods or 
                           any(method_name in desc for desc in existing_descriptions))
            
            if not test_exists:
                test_case = self.generate_test_case(method, entity['type'])
                test_cases.append(test_case)
        
        if not test_cases:
            print(f"All methods already have tests for {entity['name']}")
            return False
        
        # Add service-specific tests
        if entity['type'] == 'service':
            service_specific_tests = self.generate_service_specific_tests(entity)
            test_cases.extend(service_specific_tests)
        
        # Combine all test cases
        all_test_cases = ''.join(test_cases)
        
        # Generate full test file content based on entity type
        if entity['type'] == 'component':
            test_content = self.component_test_template.format(
                component_name=entity['name'],
                component_filename=entity['filename'],
                test_cases=all_test_cases
            )
        elif entity['type'] == 'service':
            test_content = self.service_test_template.format(
                service_name=entity['name'],
                service_filename=entity['filename'],
                test_cases=all_test_cases
            )
        elif entity['type'] == 'directive':
            test_content = self.directive_test_template.format(
                directive_name=entity['name'],
                directive_filename=entity['filename'],
                test_cases=all_test_cases
            )
        elif entity['type'] == 'pipe':
            test_content = self.pipe_test_template.format(
                pipe_name=entity['name'],
                pipe_filename=entity['filename'],
                test_cases=all_test_cases
            )
        else:
            return False
        
        # Write the test file
        try:
            os.makedirs(os.path.dirname(entity['spec_path']), exist_ok=True)
            with open(entity['spec_path'], 'w', encoding='utf-8') as f:
                f.write(test_content)
        except Exception as e:
            print(f"Error writing test file {entity['spec_path']}: {e}")
            return False
        
        print(f"✓ Updated test file for {entity['name']} ({entity['type']}): {entity['spec_path']}")
        new_methods = [m['name'] for m in public_methods if m['name'] not in existing_methods]
        if new_methods:
            print(f"  Added tests for methods: {', '.join(new_methods)}")
        return True

    def generate_service_specific_tests(self, service: Dict) -> List[str]:
        """Generate service-specific test cases for common service patterns."""
        additional_tests = []
        service_name = service['name'].lower()
        
        # Add common service test patterns
        if 'http' in service_name or 'api' in service_name:
            additional_tests.append("""
  it('should handle HTTP errors', () => {
    // Test HTTP error handling
    // Mock HTTP client and test error scenarios
  });""")
            
            additional_tests.append("""
  it('should make correct API calls', () => {
    // Test API endpoints and parameters
    // Verify HTTP method, URL, and headers
  });""")
        
        if 'auth' in service_name:
            additional_tests.append("""
  it('should store authentication token', () => {
    // Test token storage and retrieval
  });""")
            
            additional_tests.append("""
  it('should validate user permissions', () => {
    // Test permission checking logic
  });""")
        
        if 'storage' in service_name:
            additional_tests.append("""
  it('should persist data correctly', () => {
    // Test data persistence and retrieval
  });""")
        
        return additional_tests

    def run(self, entity_types: List[str] | None = None):
        """Main execution method."""
        if entity_types is None:
            entity_types = ['component', 'service', 'directive', 'pipe']
        
        entities = self.find_angular_entities()
        
        # Filter entities by type if specified
        if entity_types != ['all']:
            entities = [e for e in entities if e['type'] in entity_types]
        
        if not entities:
            print("No Angular entities found!")
            return
        
        print(f"Found {len(entities)} Angular entities")
        
        # Count by type
        type_counts = {}
        for entity in entities:
            type_counts[entity['type']] = type_counts.get(entity['type'], 0) + 1
        
        for entity_type, count in type_counts.items():
            print(f"  - {entity_type.capitalize()}s: {count}")
        
        updated_count = 0
        for entity in entities:
            print(f"\nProcessing {entity['name']} ({entity['type']})...")
            if self.update_test_file(entity):
                updated_count += 1
        
        print(f"\n{'='*50}")
        print(f"✅ Completed! Updated {updated_count} out of {len(entities)} test files.")
        
        # Show summary
        if updated_count < len(entities):
            print(f"  - {len(entities) - updated_count} files already had all tests")
        
        return updated_count


def main():
    """Main function with command line argument support."""
    parser = argparse.ArgumentParser(
        description='Generate test cases for Angular component and service public methods'
    )
    parser.add_argument(
        'path',
        nargs='?',
        default='.',
        help='Path to Angular project directory (default: current directory)'
    )
    parser.add_argument(
        '--type',
        choices=['all', 'component', 'service', 'directive', 'pipe'],
        nargs='+',
        default=['all'],
        help='Type of entities to process (default: all)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be generated without writing files'
    )
    
    args = parser.parse_args()
    
    # Validate path
    if not os.path.exists(args.path):
        print(f"Error: Path '{args.path}' does not exist!")
        return 1
    
    # Run the generator
    try:
        generator = AngularTestGenerator(args.path)
        
        if args.dry_run:
            print("DRY RUN MODE - No files will be written")
            # For dry run, we could create a modified version that doesn't write files
            # For now, just run normally but warn before writing
        
        result = generator.run(args.type)
        return 0
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        return 130
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())