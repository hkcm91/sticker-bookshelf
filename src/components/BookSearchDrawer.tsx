
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Book as BookIcon, Plus, Library } from 'lucide-react';
import { searchBooks, getCoverImageUrl, OpenLibraryBook } from '@/services/openLibraryService';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const BookSearchDrawer = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { activeShelfId, addBook } = useBookshelfStore();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchBooks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search books');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddBook = (book: OpenLibraryBook) => {
    // Get cover URL with fallback
    const coverUrl = book.cover_i ? getCoverImageUrl(book.cover_i, 'M') : '/placeholder.svg';
    
    // Find first empty slot
    const newBookId = addBook({
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      coverURL: coverUrl,
      progress: 0,
      rating: 0,
      position: -1, // The store will find an empty slot
      shelfId: activeShelfId,
      series: book.series && book.series[0] ? book.series[0] : '',
    });
    
    toast.success(`"${book.title}" added to shelf!`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Library size={16} />
          <span className="hidden md:inline">Library Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Library size={18} />
            Search Open Library
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Book title, author, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search size={16} />
            </Button>
          </div>
          
          {isSearching && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {!isSearching && searchResults.length === 0 && query && (
            <div className="text-center py-6 text-muted-foreground">
              No books found. Try a different search term.
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map((book) => (
              <div
                key={book.key}
                className="border rounded-md p-2 flex flex-col relative group"
              >
                <div className="relative pt-[140%] mb-2 bg-muted rounded">
                  <img
                    src={book.cover_i ? getCoverImageUrl(book.cover_i, 'M') : '/placeholder.svg'}
                    alt={book.title}
                    className="absolute inset-0 h-full w-full object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <Button 
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAddBook(book)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <h3 className="font-medium text-sm line-clamp-2" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {book.author_name ? book.author_name[0] : 'Unknown'}
                  {book.first_publish_year && ` (${book.first_publish_year})`}
                </p>
                <div className="absolute top-1.5 left-1.5 bg-background/80 rounded-full p-1">
                  <BookIcon size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
          
          {!isSearching && searchResults.length > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Click the + button on any book to add it to your bookshelf
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookSearchDrawer;
